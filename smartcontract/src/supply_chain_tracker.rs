use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, String, Vec, U128,
};

#[derive(Clone)]
#[contracttype]
pub struct Shipment {
    pub id: String,
    pub item_name: String,
    pub quantity: U128,
    pub origin_location: String,
    pub destination_location: String,
    pub status: String,
    pub temperature_monitored: bool,
    pub min_temp: i32,
    pub max_temp: i32,
    pub created_at: u64,
    pub checkpoints: Vec<Checkpoint>,
}

#[derive(Clone)]
#[contracttype]
pub struct Checkpoint {
    pub location: String,
    pub status: String,
    pub timestamp: u64,
    pub notes: String,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Shipments,
    ShipmentDetails(String),
    ShipmentHistory(String),
}

#[contract]
pub struct SupplyChainTrackerContract;

#[contractimpl]
impl SupplyChainTrackerContract {
    /// Initialize contract
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();

        if env.storage().persistent().has(&DataKey::Admin) {
            panic!("Contract already initialized");
        }

        env.storage().persistent().set(&DataKey::Admin, &admin);
    }

    /// Create new shipment with tracking
    pub fn create_shipment(
        env: Env,
        admin: Address,
        shipment_id: String,
        item_name: String,
        quantity: U128,
        origin_location: String,
        destination_location: String,
        temperature_monitored: bool,
        min_temp: i32,
        max_temp: i32,
    ) -> Shipment {
        admin.require_auth();

        let contract_admin: Address = env
            .storage()
            .persistent()
            .get(&DataKey::Admin)
            .expect("Contract not initialized");

        if admin != contract_admin {
            panic!("Only admin can create shipments");
        }

        let shipment = Shipment {
            id: shipment_id.clone(),
            item_name,
            quantity,
            origin_location,
            destination_location,
            status: String::from_slice(&env, "created"),
            temperature_monitored,
            min_temp,
            max_temp,
            created_at: env.ledger().timestamp(),
            checkpoints: Vec::new(&env),
        };

        env.storage().persistent().set(
            &DataKey::ShipmentDetails(shipment_id.clone()),
            &shipment,
        );

        env.events()
            .publish((symbol_short!("create"), admin), shipment.clone());

        shipment
    }

    /// Update shipment checkpoint
    pub fn update_checkpoint(
        env: Env,
        admin: Address,
        shipment_id: String,
        location: String,
        status: String,
        notes: String,
    ) {
        admin.require_auth();

        let contract_admin: Address = env
            .storage()
            .persistent()
            .get(&DataKey::Admin)
            .expect("Contract not initialized");

        if admin != contract_admin {
            panic!("Only admin can update checkpoints");
        }

        let mut shipment: Shipment = env
            .storage()
            .persistent()
            .get(&DataKey::ShipmentDetails(shipment_id.clone()))
            .expect("Shipment not found");

        let checkpoint = Checkpoint {
            location,
            status: status.clone(),
            timestamp: env.ledger().timestamp(),
            notes,
        };

        shipment.checkpoints.push_back(checkpoint);
        shipment.status = status;

        env.storage().persistent().set(
            &DataKey::ShipmentDetails(shipment_id.clone()),
            &shipment,
        );

        env.events()
            .publish((symbol_short!("checkpoint"), admin), shipment_id);
    }

    /// Confirm delivery
    pub fn confirm_delivery(
        env: Env,
        admin: Address,
        shipment_id: String,
        recipient: Address,
        condition: String,
        notes: String,
    ) {
        admin.require_auth();
        recipient.require_auth();

        let mut shipment: Shipment = env
            .storage()
            .persistent()
            .get(&DataKey::ShipmentDetails(shipment_id.clone()))
            .expect("Shipment not found");

        let checkpoint = Checkpoint {
            location: String::from_slice(&env, "delivery_point"),
            status: String::from_slice(&env, "delivered"),
            timestamp: env.ledger().timestamp(),
            notes,
        };

        shipment.checkpoints.push_back(checkpoint);
        shipment.status = String::from_slice(&env, "delivered");

        env.storage().persistent().set(
            &DataKey::ShipmentDetails(shipment_id.clone()),
            &shipment,
        );

        env.events().publish(
            (symbol_short!("deliver"), admin),
            (shipment_id, recipient, condition),
        );
    }

    /// Get shipment history
    pub fn get_shipment_history(env: Env, shipment_id: String) -> Shipment {
        env.storage()
            .persistent()
            .get(&DataKey::ShipmentDetails(shipment_id))
            .expect("Shipment not found")
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_shipment() {
        // Test would go here
        assert!(true);
    }
}
