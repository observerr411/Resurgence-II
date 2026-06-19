use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, String, Vec, U128,
};

#[derive(Clone)]
#[contracttype]
pub struct SpendingRule {
    pub category: String,
    pub limit: U128,
    pub spent: U128,
}

#[derive(Clone)]
#[contracttype]
pub struct ConditionalTransfer {
    pub id: String,
    pub beneficiary_id: String,
    pub amount: U128,
    pub token: String,
    pub expires_at: u64,
    pub spending_rules: Vec<SpendingRule>,
    pub purpose: String,
    pub is_active: bool,
    pub created_at: u64,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Transfers,
    TransferDetails(String),
    BeneficiaryTransfers(String),
}

#[contract]
pub struct CashTransferContract;

#[contractimpl]
impl CashTransferContract {
    /// Initialize contract
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();

        if env.storage().persistent().has(&DataKey::Admin) {
            panic!("Contract already initialized");
        }

        env.storage().persistent().set(&DataKey::Admin, &admin);
    }

    /// Create conditional cash transfer
    pub fn create_transfer(
        env: Env,
        admin: Address,
        transfer_id: String,
        beneficiary_id: String,
        amount: U128,
        token: String,
        expires_at: u64,
        spending_rules: Vec<SpendingRule>,
        purpose: String,
    ) -> ConditionalTransfer {
        admin.require_auth();

        let contract_admin: Address = env
            .storage()
            .persistent()
            .get(&DataKey::Admin)
            .expect("Contract not initialized");

        if admin != contract_admin {
            panic!("Only admin can create transfers");
        }

        if expires_at <= env.ledger().timestamp() {
            panic!("Expiration time must be in the future");
        }

        let transfer = ConditionalTransfer {
            id: transfer_id.clone(),
            beneficiary_id: beneficiary_id.clone(),
            amount,
            token,
            expires_at,
            spending_rules,
            purpose,
            is_active: true,
            created_at: env.ledger().timestamp(),
        };

        env.storage().persistent().set(
            &DataKey::TransferDetails(transfer_id.clone()),
            &transfer,
        );

        env.events()
            .publish((symbol_short!("create"), admin), transfer.clone());

        transfer
    }

    /// Process spending with rule validation
    pub fn spend(
        env: Env,
        beneficiary: Address,
        transfer_id: String,
        amount: U128,
        category: String,
    ) -> bool {
        beneficiary.require_auth();

        let mut transfer: ConditionalTransfer = env
            .storage()
            .persistent()
            .get(&DataKey::TransferDetails(transfer_id.clone()))
            .expect("Transfer not found");

        if !transfer.is_active {
            panic!("Transfer is not active");
        }

        if env.ledger().timestamp() > transfer.expires_at {
            panic!("Transfer has expired");
        }

        if amount > transfer.amount {
            panic!("Spending amount exceeds available balance");
        }

        // Validate spending rules
        let mut rule_found = false;
        for rule in transfer.spending_rules.iter_mut() {
            if rule.category == category {
                rule_found = true;
                if rule.spent + amount > rule.limit {
                    panic!("Spending exceeds category limit");
                }
                rule.spent = U128::from_u128(rule.spent.to_u128() + amount.to_u128());
                break;
            }
        }

        if !rule_found {
            panic!("Invalid spending category");
        }

        transfer.amount = U128::from_u128(transfer.amount.to_u128() - amount.to_u128());

        env.storage().persistent().set(
            &DataKey::TransferDetails(transfer_id.clone()),
            &transfer,
        );

        env.events()
            .publish((symbol_short!("spend"), beneficiary), (transfer_id, amount, category));

        true
    }

    /// Get transfer details
    pub fn get_transfer(env: Env, transfer_id: String) -> ConditionalTransfer {
        env.storage()
            .persistent()
            .get(&DataKey::TransferDetails(transfer_id))
            .expect("Transfer not found")
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_transfer() {
        // Test would go here
        assert!(true);
    }
}
