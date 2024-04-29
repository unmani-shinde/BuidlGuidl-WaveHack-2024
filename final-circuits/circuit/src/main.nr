use dep::std;
fn main(secret: [u8; 4], public_hash_input: pub [u8; 32]) {
    let hash = std::hash::sha256(secret);
    assert(hash==public_hash_input);
}
#[test]
fn test_main() {
    let public_hash_input =  [95,  83, 192, 255,   7, 186,  93, 154,
   51,  14, 104, 201,  93, 171, 177, 169,
  188,  73, 226, 159, 158, 213,  63, 111,
  167, 198, 217, 154, 187,   0,   0,  80];
  let secret = [10, 20, 30, 40];
  
  main(secret, public_hash_input);
}
