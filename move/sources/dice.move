module dice::dice {
    use std::signer::address_of;
    use std::vector;
    use aptos_framework::randomness;

    struct DiceRollHistory has key {
        rolls: vector<vector<u64>>,
    }

    public entry fun roll(account: signer) acquires DiceRollHistory {
        let addr = address_of(&account);
        let roll_history = if (exists<DiceRollHistory>(addr)) {
            move_from<DiceRollHistory>(addr)
        } else {
            DiceRollHistory { rolls: vector[vector[]] }
        };
        let new_vector = vector<u64>[];
        let i=0;
        while(i < 4){
            let new_roll = randomness::u64_range(0, 3);
            vector::push_back(&mut new_vector, new_roll);
            i=i+1;
        };
        vector::push_back(&mut roll_history.rolls, new_vector);
        move_to(&account, roll_history);
    }
}