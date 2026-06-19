use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, String, Symbol, Vec, Bool,
};

#[derive(Clone)]
#[contracttype]
pub enum VerificationFactor {
    Possession { value: String, weight: u32 },
    Behavioral { value: String, weight: u32 },
    Social { value: String, weight: u32 },
}

#[derive(Clone)]
#[contracttype]
pub struct Beneficiary {
    pub id: String,
    pub name: String,
    pub location: String,
    pub wallet_address: Address,
    pub family_size: u32,
    pub special_needs: Vec<String>,
    pub verification_factors: Vec<VerificationFactor>,
    pub is_verified: bool,
    pub created_at: u64,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Beneficiaries,
    BeneficiaryDetails(String),
    VerificationStatus(String),
}

#[contract]
pub struct BeneficiaryManagerContract;

#[contractimpl]
impl BeneficiaryManagerContract {
    /// Initialize contract
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();

        if env.storage().persistent().has(&DataKey::Admin) {
            panic!("Contract already initialized");
        }

        env.storage().persistent().set(&DataKey::Admin, &admin);
    }

    /// Register a new beneficiary with biometric-free verification
    pub fn register_beneficiary(
        env: Env,
        admin: Address,
        beneficiary_id: String,
        name: String,
        location: String,
        wallet_address: Address,
        family_size: u32,
        special_needs: Vec<String>,
        verification_factors: Vec<VerificationFactor>,
    ) -> Beneficiary {
        admin.require_auth();

        let contract_admin: Address = env
            .storage()
            .persistent()
            .get(&DataKey::Admin)
            .expect("Contract not initialized");

        if admin != contract_admin {
            panic!("Only admin can register beneficiaries");
        }

        let beneficiary = Beneficiary {
            id: beneficiary_id.clone(),
            name,
            location,
            wallet_address,
            family_size,
            special_needs,
            verification_factors,
            is_verified: false,
            created_at: env.ledger().timestamp(),
        };

        env.storage().persistent().set(
            &DataKey::BeneficiaryDetails(beneficiary_id.clone()),
            &beneficiary,
        );

        env.events()
            .publish((symbol_short!("register"), admin), beneficiary.clone());

        beneficiary
    }

    /// Verify beneficiary
    pub fn verify_beneficiary(env: Env, admin: Address, beneficiary_id: String, verified: bool) {
        admin.require_auth();

        let contract_admin: Address = env
            .storage()
            .persistent()
            .get(&DataKey::Admin)
            .expect("Contract not initialized");

        if admin != contract_admin {
            panic!("Only admin can verify beneficiaries");
        }

        let mut beneficiary: Beneficiary = env
            .storage()
            .persistent()
            .get(&DataKey::BeneficiaryDetails(beneficiary_id.clone()))
            .expect("Beneficiary not found");

        beneficiary.is_verified = verified;

        env.storage().persistent().set(
            &DataKey::BeneficiaryDetails(beneficiary_id.clone()),
            &beneficiary,
        );

        env.events().publish(
            (symbol_short!("verify"), admin),
            (beneficiary_id, verified),
        );
    }

    /// Get beneficiary details
    pub fn get_beneficiary(env: Env, beneficiary_id: String) -> Beneficiary {
        env.storage()
            .persistent()
            .get(&DataKey::BeneficiaryDetails(beneficiary_id))
            .expect("Beneficiary not found")
    }

    /// Generate QR code data
    pub fn generate_qr_code(env: Env, beneficiary_id: String) -> String {
        let beneficiary = Self::get_beneficiary(env.clone(), beneficiary_id);

        if !beneficiary.is_verified {
            panic!("Beneficiary must be verified to generate QR code");
        }

        // In production, this would encode beneficiary data into a QR code format
        String::from_slice(&env, "QR_CODE_DATA_PLACEHOLDER")
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_register_beneficiary() {
        // Test would go here
        assert!(true);
    }
}
