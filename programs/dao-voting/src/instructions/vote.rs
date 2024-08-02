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
     // Decode the zk-proof from bytes
     let proof = Proof::<Bls12>::read(&zk_proof[..]).map_err(|_| CustomError::InvalidProof)?;

     // Decode the public input and convert it to a Scalar
     let vk_bytes = hex::decode(&public_input).map_err(|_| CustomError::InvalidPublicInput)?;
     if vk_bytes.len() != 32 {
         return Err(CustomError::InvalidPublicInput.into());
     }
     let mut array = [0u8; 64];
     array.copy_from_slice(&vk_bytes);
     let scalar = Scalar::from_bytes_wide(&array);
 
     // Decode and prepare the verifying key
     let vk = GrothVerifyingKey::<Bls12>::read(verifying_key).map_err(|_| CustomError::InvalidVerifyingKey)?;
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
    pub proposal: Account<'info, Proposal>,
    #[account(
        init,
        seeds = [title.as_bytes(), user.key().as_ref()],
        bump,
        payer = user,
        space = 8 + UserVote::INIT_SPACE
    )]
    pub user_vote: Account<'info, UserVote>,
    #[account(
        init,
        seeds = [user.key.as_ref()],
        bump,
        payer = user,
        space = 8 + 32 + 8
    )]
    pub verifying_key: Account<'info, VerifyingKey>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}


#[account]
pub struct VerifyingKey {
    pub key: Vec<u8>,
}