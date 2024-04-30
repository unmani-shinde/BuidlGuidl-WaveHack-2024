use dep::std;
fn main(secret: [u8; 4], public_hash_input: pub [u8; 32]) {
    let hash = std::hash::sha256(secret);
    assert(hash==public_hash_input);
}