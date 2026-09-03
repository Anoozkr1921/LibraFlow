require("dotenv").config();

const embeddings = require("./embeddingModel");

const test = async () => {

    const vector = await embeddings.embedQuery(
        "A book about programming and software development"
    );

    console.log("Embedding generated!");
    console.log("Vector length:", vector.length);
    console.log("First 10 values:", vector.slice(0, 10));
};

test();