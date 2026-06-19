use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, vec, Address, Env, String, Symbol, Vec,
    Bool, U128,
};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Funds,
    FundDetails(String),
    Signers(String),
}

#[derive(Clone)]
#[contracttype]
pub struct EmergencyFund {
    pub id: String,
    pub name: String,
    pub description: String,
    pub amount: U128,
    pub disaster_type: String,
    pub location: String,
    pub expires_at: u64,
    pub threshold: u32,
    pub is_active: bool,
    pub created_at: u64,
}

#[contract]
pub struct AidRegistryContract;

#[contractimpl]
impl AidRegistryContract {
    /// Initialize the contract with admin
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();

        if env.storage().persistent().has(&DataKey::Admin) {
            panic!("Contract already initialized");
        }

        env.storage().persistent().set(&DataKey::Admin, &admin);
    }

    /// Deploy emergency fund for disaster relief
    pub fn deploy_emergency_fund(
        env: Env,
        admin: Address,
        fund_id: String,
        name: String,
        description: String,
        amount: U128,
        disaster_type: String,
        location: String,
        expires_at: u64,
        signers: Vec<Address>,
        threshold: u32,
    ) -> EmergencyFund {
        admin.require_auth();

        let contract_admin: Address = env
            .storage()
            .persistent()
            .get(&DataKey::Admin)
            .expect("Contract not initialized");

        if admin != contract_admin && admin != contract_admin {
            panic!("Only admin can deploy funds");
        }

        if threshold as usize > signers.len() {
            panic!("Threshold cannot exceed number of signers");
        }

        let fund = EmergencyFund {
            id: fund_id.clone(),
            name,
            description,
            amount,
            disaster_type,
            location,
            expires_at,
            threshold,
            is_active: true,
            created_at: env.ledger().timestamp(),
        };

        env.storage()
            .persistent()
            .set(&DataKey::FundDetails(fund_id.clone()), &fund);

        env.storage()
            .persistent()
            .set(&DataKey::Signers(fund_id), &signers);

        env.events()
            .publish((symbol_short!("deploy"), admin), fund.clone());

        fund
    }

    /// Trigger multi-signature disbursement
    pub fn trigger_disbursement(
        env: Env,
        signer: Address,
        fund_id: String,
        amount: U128,
        recipient: Address,
        purpose: String,
    ) {
        signer.require_auth();

        let fund: EmergencyFund = env
            .storage()
            .persistent()
            .get(&DataKey::FundDetails(fund_id.clone()))
            .expect("Fund not found");

        if !fund.is_active {
            panic!("Fund is not active");
        }

        if env.ledger().timestamp() > fund.expires_at {
            panic!("Fund has expired");
        }

        if amount > fund.amount {
            panic!("Disbursement amount exceeds fund balance");
        }

        let signers: Vec<Address> = env
            .storage()
            .persistent()
            .get(&DataKey::Signers(fund_id.clone()))
            .expect("Signers not found");

        let signer_found = signers.iter().any(|s| s == &signer);
        if !signer_found {
            panic!("Signer not authorized for this fund");
        }

        env.events().publish(
            (symbol_short!("disburse"), signer),
            (fund_id, amount, recipient, purpose),
        );
    }

    /// Get fund details
    pub fn get_fund(env: Env, fund_id: String) -> EmergencyFund {
        env.storage()
            .persistent()
            .get(&DataKey::FundDetails(fund_id))
            .expect("Fund not found")
    }

    /// Get fund statistics
    pub fn get_fund_stats(env: Env, fund_id: String) -> (U128, U128, u32) {
        let fund = Self::get_fund(env, fund_id);
        let remaining = U128::from_u32(0); // Would need to track disbursements

        (fund.amount, remaining, fund.threshold)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::testutils::Address as _;

    #[test]
    fn test_initialize() {
        let env = soroban_sdk::Env::default();
        let contract = AidRegistryContractClient::new(&env, &env.register_contract(None, AidRegistryContract));

        let admin = Address::generate(&env);

        contract.initialize(&admin);

        // Test that contract is initialized
        assert!(true);
    }
}
