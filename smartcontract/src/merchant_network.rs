use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, String, Symbol, Vec, U128,
};

#[derive(Clone)]
#[contracttype]
pub struct Merchant {
    pub id: String,
    pub name: String,
    pub category: String,
    pub location: String,
    pub wallet_address: Address,
    pub is_verified: bool,
    pub created_at: u64,
    pub total_transactions: u32,
    pub total_volume: U128,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Merchants,
    MerchantDetails(String),
    MerchantStats(String),
}

#[contract]
pub struct MerchantNetworkContract;

#[contractimpl]
impl MerchantNetworkContract {
    /// Initialize contract
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();

        if env.storage().persistent().has(&DataKey::Admin) {
            panic!("Contract already initialized");
        }

        env.storage().persistent().set(&DataKey::Admin, &admin);
    }

    /// Register merchant in the network
    pub fn register_merchant(
        env: Env,
        admin: Address,
        merchant_id: String,
        name: String,
        category: String,
        location: String,
        wallet_address: Address,
    ) -> Merchant {
        admin.require_auth();

        let contract_admin: Address = env
            .storage()
            .persistent()
            .get(&DataKey::Admin)
            .expect("Contract not initialized");

        if admin != contract_admin {
            panic!("Only admin can register merchants");
        }

        let merchant = Merchant {
            id: merchant_id.clone(),
            name,
            category,
            location,
            wallet_address,
            is_verified: false,
            created_at: env.ledger().timestamp(),
            total_transactions: 0,
            total_volume: U128::from_u32(0),
        };

        env.storage().persistent().set(
            &DataKey::MerchantDetails(merchant_id.clone()),
            &merchant,
        );

        env.events()
            .publish((symbol_short!("register"), admin), merchant.clone());

        merchant
    }

    /// Verify merchant
    pub fn verify_merchant(env: Env, admin: Address, merchant_id: String, verified: bool) {
        admin.require_auth();

        let contract_admin: Address = env
            .storage()
            .persistent()
            .get(&DataKey::Admin)
            .expect("Contract not initialized");

        if admin != contract_admin {
            panic!("Only admin can verify merchants");
        }

        let mut merchant: Merchant = env
            .storage()
            .persistent()
            .get(&DataKey::MerchantDetails(merchant_id.clone()))
            .expect("Merchant not found");

        merchant.is_verified = verified;

        env.storage().persistent().set(
            &DataKey::MerchantDetails(merchant_id.clone()),
            &merchant,
        );

        env.events()
            .publish((symbol_short!("verify"), admin), (merchant_id, verified));
    }

    /// Get merchant details
    pub fn get_merchant(env: Env, merchant_id: String) -> Merchant {
        env.storage()
            .persistent()
            .get(&DataKey::MerchantDetails(merchant_id))
            .expect("Merchant not found")
    }

    /// Record transaction
    pub fn record_transaction(
        env: Env,
        merchant_id: String,
        amount: U128,
    ) {
        let mut merchant = Self::get_merchant(env.clone(), merchant_id.clone());

        if !merchant.is_verified {
            panic!("Merchant must be verified to process transactions");
        }

        merchant.total_transactions += 1;
        merchant.total_volume = U128::from_u128(merchant.total_volume.to_u128() + amount.to_u128());

        env.storage()
            .persistent()
            .set(&DataKey::MerchantDetails(merchant_id), &merchant);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_register_merchant() {
        // Test would go here
        assert!(true);
    }
}
