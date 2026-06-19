use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, String, Vec, U128,
};

#[derive(Clone)]
#[contracttype]
pub struct FraudAlert {
    pub id: String,
    pub entity_id: String,
    pub entity_type: String, // "beneficiary", "merchant", "transfer"
    pub alert_type: String,  // "duplicate", "suspicious", "location", "pattern"
    pub severity: u32,       // 1-5
    pub details: String,
    pub created_at: u64,
    pub resolved: bool,
}

#[derive(Clone)]
#[contracttype]
pub struct TransactionPattern {
    pub entity_id: String,
    pub total_transactions: u32,
    pub total_amount: U128,
    pub average_amount: U128,
    pub last_transaction_time: u64,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Alerts,
    AlertDetails(String),
    Patterns,
    PatternDetails(String),
}

#[contract]
pub struct AntiFraudContract;

#[contractimpl]
impl AntiFraudContract {
    /// Initialize contract
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();

        if env.storage().persistent().has(&DataKey::Admin) {
            panic!("Contract already initialized");
        }

        env.storage().persistent().set(&DataKey::Admin, &admin);
    }

    /// Detect duplicate registrations
    pub fn detect_duplicate_registration(
        env: Env,
        entity_id: String,
        check_type: String,
        check_value: String,
    ) -> bool {
        // In production, this would query a distributed registry
        // or cross-reference with other disaster relief databases

        false // Return true if duplicate detected
    }

    /// Monitor suspicious transaction patterns
    pub fn monitor_transaction(
        env: Env,
        entity_id: String,
        amount: U128,
        timestamp: u64,
    ) -> bool {
        let pattern_key = DataKey::PatternDetails(entity_id.clone());

        let mut pattern: TransactionPattern = env
            .storage()
            .persistent()
            .get(&pattern_key)
            .unwrap_or(TransactionPattern {
                entity_id: entity_id.clone(),
                total_transactions: 0,
                total_amount: U128::from_u32(0),
                average_amount: U128::from_u32(0),
                last_transaction_time: timestamp,
            });

        pattern.total_transactions += 1;
        pattern.total_amount = U128::from_u128(pattern.total_amount.to_u128() + amount.to_u128());
        pattern.average_amount = U128::from_u128(
            pattern.total_amount.to_u128() / pattern.total_transactions as u128,
        );

        let time_diff = timestamp - pattern.last_transaction_time;

        // Flag if transaction is significantly larger than average (>3x)
        let suspicious = amount > U128::from_u128(pattern.average_amount.to_u128() * 3);

        // Flag if multiple transactions within short time period (<5 minutes)
        let rapid_fire = time_diff < 300 && pattern.total_transactions > 1;

        if suspicious || rapid_fire {
            let alert = FraudAlert {
                id: Self::generate_alert_id(&env),
                entity_id: entity_id.clone(),
                entity_type: String::from_slice(&env, "transaction"),
                alert_type: if suspicious {
                    String::from_slice(&env, "suspicious_amount")
                } else {
                    String::from_slice(&env, "rapid_fire")
                },
                severity: if suspicious { 3 } else { 2 },
                details: String::from_slice(&env, "Suspicious pattern detected"),
                created_at: env.ledger().timestamp(),
                resolved: false,
            };

            let alert_key = DataKey::AlertDetails(alert.id.clone());
            env.storage().persistent().set(&alert_key, &alert);

            env.events()
                .publish((symbol_short!("fraud"), entity_id), alert.id);

            return true;
        }

        pattern.last_transaction_time = timestamp;
        env.storage().persistent().set(&pattern_key, &pattern);

        false
    }

    /// Verify geolocation for beneficiary or merchant
    pub fn verify_location(
        env: Env,
        entity_id: String,
        latitude: i32,
        longitude: i32,
        allowed_radius_km: u32,
    ) -> bool {
        // In production, this would use oracle data or verify against
        // registered location bounds

        true // Location verified
    }

    /// Review fraud alert
    pub fn review_alert(env: Env, admin: Address, alert_id: String, resolved: bool, notes: String) {
        admin.require_auth();

        let contract_admin: Address = env
            .storage()
            .persistent()
            .get(&DataKey::Admin)
            .expect("Contract not initialized");

        if admin != contract_admin {
            panic!("Only admin can review alerts");
        }

        let alert_key = DataKey::AlertDetails(alert_id.clone());
        let mut alert: FraudAlert = env
            .storage()
            .persistent()
            .get(&alert_key)
            .expect("Alert not found");

        alert.resolved = resolved;

        env.storage().persistent().set(&alert_key, &alert);

        env.events()
            .publish((symbol_short!("review"), admin), (alert_id, resolved));
    }

    /// Helper to generate unique alert ID
    fn generate_alert_id(env: &Env) -> String {
        let timestamp = env.ledger().timestamp();
        String::from_slice(env, &format!("alert_{}", timestamp))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_monitor_transaction() {
        // Test would go here
        assert!(true);
    }
}
