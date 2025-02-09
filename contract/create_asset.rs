use anchor_lang::prelude::*;

declare_id!("EsQzosNPuUQqTamLa3duvkD7pQyoNjKPGbgf7FBcqjSo");

#[program]
pub mod solana_asset_manager {
    use super::*;

    // Create a new asset record
    pub fn create_asset(
        ctx: Context<CreateAsset>,
        name: String,
        code: String,
        asset_type: String,
        decimals: u8,
        initial_supply: u64,
        limit: Option<u64>,
        authorize_required: bool,
        freeze_enabled: bool,
        clawback_enabled: bool,
        regulated: bool,
    ) -> Result<()> {
        let asset = &mut ctx.accounts.asset_metadata;
        let user = &ctx.accounts.user;

        asset.name = name;
        asset.code = code;
        asset.asset_type = asset_type;
        asset.decimals = decimals;
        asset.initial_supply = initial_supply;
        asset.limit = limit;
        asset.authorize_required = authorize_required;
        asset.freeze_enabled = freeze_enabled;
        asset.clawback_enabled = clawback_enabled;
        asset.regulated = regulated;
        asset.owner = user.key();

        msg!("Asset created: {} ({})", asset.name, asset.code);
        Ok(())
    }

    // Get asset details
    pub fn get_asset(ctx: Context<GetAsset>) -> Result<()> {
        let asset = &ctx.accounts.asset_metadata;

        // Verify the asset belongs to the user
        require!(
            asset.owner == ctx.accounts.user.key(),
            CustomError::UnauthorizedAccess
        );

        msg!("Asset: {} ({})", asset.name, asset.code);
        msg!("Type: {}", asset.asset_type);
        msg!("Decimals: {}", asset.decimals);
        msg!("Initial Supply: {}", asset.initial_supply);
        msg!("Supply Limit: {:?}", asset.limit);
        msg!("Authorization Required: {}", asset.authorize_required);
        msg!("Freeze Enabled: {}", asset.freeze_enabled);
        msg!("Clawback Enabled: {}", asset.clawback_enabled);
        msg!("Regulated: {}", asset.regulated);
        msg!("Owner: {}", asset.owner);
        Ok(())
    }
}

// Custom errors
#[error_code]
pub enum CustomError {
    #[msg("You are not authorized to access this asset")]
    UnauthorizedAccess,
}

// Asset metadata storage
#[account]
pub struct AssetMetadata {
    pub name: String,             // Asset name
    pub code: String,             // Asset code (symbol)
    pub asset_type: String,       // Asset type
    pub decimals: u8,             // Number of decimal places
    pub initial_supply: u64,      // Initial supply
    pub limit: Option<u64>,       // Optional supply limit
    pub authorize_required: bool, // Requires authorization for holding
    pub freeze_enabled: bool,     // Allows freezing of assets
    pub clawback_enabled: bool,   // Allows clawback (asset recall)
    pub regulated: bool,          // If regulated
    pub owner: Pubkey,            // Owner's public key
}

// Accounts needed for create_asset
#[derive(Accounts)]
pub struct CreateAsset<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + // discriminator
                32 + // name (max)
                32 + // code (max)
                32 + // asset_type (max)
                1 +  // decimals
                8 +  // initial_supply
                9 +  // limit (Option<u64>)
                1 +  // authorize_required
                1 +  // freeze_enabled
                1 +  // clawback_enabled
                1 +  // regulated
                32   // owner pubkey
    )]
    pub asset_metadata: Account<'info, AssetMetadata>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

// Accounts needed for get_asset
#[derive(Accounts)]
pub struct GetAsset<'info> {
    pub asset_metadata: Account<'info, AssetMetadata>,
    pub user: Signer<'info>,
}
