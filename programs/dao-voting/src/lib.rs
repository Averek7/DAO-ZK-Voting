use anchor_lang::prelude::*;
use instructions::create_proposal::*;
use instructions::reward_participation::*;
use instructions::vote::*;

pub mod instructions;
pub mod state;

declare_id!("BwydVvtLyvVjB1TyyjF8zqJ6zXHFLF4jWcqHoxuMifAT");

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

    pub fn vote(ctx: Context<Vote>, title: String, vote: bool) -> Result<()> {
        vote_handler(ctx, title, vote)
    }

    pub fn reward_participation(
        ctx: Context<RewardParticipation>,
        voter_pubkey: Pubkey,
    ) -> Result<()> {
        reward_participation_handler(ctx, voter_pubkey)
    }
}
