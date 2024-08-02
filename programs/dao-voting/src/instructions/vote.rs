use crate::state::*;
use crate::error::*;
use anchor_lang::prelude::*;
use bellman::groth16::{prepare_verifying_key, verify_proof, Proof};
use bellman::groth16::VerifyingKey as GrothVerifyingKey;
use bls12_381::{Bls12, Scalar};

pub fn vote_handler(
    ctx: Context<Vote>,
    title: String,
    vote: bool,
    zk_proof: Vec<u8>,
    public_input: String,
) -> Result<()> {
    let proposal = &mut ctx.accounts.proposal;
    let user_vote = &mut ctx.accounts.user_vote;

    let verifying_key_bytes = ctx.accounts.verifying_key.key.clone();
    verify_zk_proof(zk_proof, public_input, &verifying_key_bytes)?;

    if vote {
        proposal.yes_votes += 1; 
    } else {
        proposal.no_votes += 1;
    }

    user_vote.voted = true;
    user_vote.voter = ctx.accounts.user.key();
    user_vote.proposal_title = title;

    Ok(())
}

fn verify_zk_proof(zk_proof: Vec<u8>, public_input: String, verifying_key: &[u8]) -> Result<()> {
    // Deserialize and verify zk-SNARK proof
    let proof = Proof::<Bls12>::read(&zk_proof[..]).map_err(|_| CustomError::InvalidProof)?;

    // Convert public input from string to Scalar
    let bytes = hex::decode(&public_input).map_err(|_| CustomError::InvalidPublicInput)?;
    require!(bytes.len() == 32, CustomError::InvalidPublicInput); // Ensure bytes length is correct

    let mut array = [0u8; 64]; // Use a 64-byte array
    array[..32].copy_from_slice(&bytes);
    let scalar = Scalar::from_bytes_wide(&array);

    // Deserialize verifying key
    let vk = GrothVerifyingKey::<Bls12>::read(verifying_key).map_err(|_| CustomError::ProofVerificationFailed)?;
    let pvk = prepare_verifying_key(&vk);

    // Verify the proof
    let result = verify_proof(&pvk, &proof, &[scalar]);
    if result.is_err() {
        return Err(CustomError::ProofVerificationFailed.into());
    }
    Ok(())
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct Vote<'info> {
    #[account(
        mut,
        seeds = [title.as_bytes()],
        bump,
        realloc = 8 + Proposal::INIT_SPACE,
        realloc::payer = user,
        realloc::zero = true
    )]
    pub proposal: Box<Account<'info, Proposal>>,
    #[account(
        init,
        seeds = [title.as_bytes(), user.key().as_ref()],
        bump,
        payer = user,
        space = 8 + UserVote::INIT_SPACE
    )]
    pub user_vote: Box<Account<'info, UserVote>>,
    #[account(
        init,
        seeds = [b"verifyKey".as_ref(), user.key().as_ref()],
        bump,
        payer = user,
        space = VerifyingKey::INIT_SPACE,
    )]
    pub verifying_key: Box<Account<'info, VerifyingKey>>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
