use anchor_lang::prelude::*;

#[error_code]
pub enum CustomError {
    #[msg("The voting is not active.")]
    VoteInactive,
    #[msg("You have already voted.")]
    AlreadyVoted,
    #[msg("Invalid ZK proof.")]
    InvalidProof,
    #[msg("Invalid verifying key.")]
    InvalidVerifyingKey,
    #[msg("Invalid public input.")]
    InvalidPublicInput,
    #[msg("Proof verification failed.")]
    ProofVerificationFailed,
}
