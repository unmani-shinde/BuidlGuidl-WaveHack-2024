async function sha256(secret) {
    // Convert the secret array to Uint8Array
    const secretArray = new Uint8Array(secret);

    try {
        // Create an ArrayBuffer from the secret array
        const secretBuffer = secretArray.buffer;

        // Generate the hash
        const hashArrayBuffer = await crypto.subtle.digest("SHA-256", secretBuffer);

        // Convert the hash ArrayBuffer to Uint8Array
        const hashUint8Array = new Uint8Array(hashArrayBuffer);

        // Convert the hash Uint8Array to an array of numbers
        const hashArray = Array.from(hashUint8Array);

        // Check if the length is 32
        if (hashArray.length !== 32) {
            throw new Error("Invalid hash length. Expected length: 32");
        }

        // Return the hash as a 32-field byte array
        return hashArray;
    } catch (error) {
        console.error("Error computing SHA-256 hash:", error);
        throw error;
    }
}

// Example usage
const secret = [10, 20, 30, 40];
const public_hash_input = [ 95,  83, 192, 255,   7, 186,  93, 154,
    51,  14, 104, 201,  93, 171, 177, 169,
   188,  73, 226, 159, 158, 213,  63, 111,
   167, 198, 217, 154, 187,   0,   0,  80];
sha256(secret)
    .then(hash => {
        // Check if the hash matches the expected length
        if (hash.length === 32) {
            console.log("SHA-256 hash:", hash);
            // Compare the hash with the public_hash_input
            const isEqual = hash.every((value, index) => value === public_hash_input[index]);
            console.log("Hash comparison result:", isEqual ? "Match" : "Mismatch");
        } else {
            console.error("Invalid hash length. Expected length: 32");
        }
    })
    .catch(error => console.error("Error computing SHA-256 hash:", error));
