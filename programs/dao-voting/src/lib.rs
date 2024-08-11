use anchor_lang::prelude::*;
use instructions::create_proposal::*;
use instructions::reward_participation::*;
use instructions::vote::*;

pub mod instructions;
pub mod state;
pub mod error;

declare_id!("8twZTybaCyudgUKJPEkdgD9SkFfoABrUsx86gwKgnv8h");

#[program]
pub mod dao_voting {
    use super::*;

    pub fn create_proposal(
        ctx: Context<CreateProposal>,
        title: String,
        description: String,
    ) -> Result<()> {
        create_proposal_handler(ctx, title, description)
    }

    pub fn vote(ctx: Context<Vote>, title: String, vote: bool, zk_proof: Vec<u8>, public_input: String ) -> Result<()> {
        vote_handler(ctx, title, vote, zk_proof, public_input)
    }

    pub fn reward_participation(
        ctx: Context<RewardParticipation>,
        voter_pubkey: Pubkey,
    ) -> Result<()> {
        reward_participation_handler(ctx, voter_pubkey)
    }
}
