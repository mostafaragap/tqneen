const IdCounter = require("../index")
exports.autoIncrement = function (field) {
    return async function (next) {
        const doc = this;
        const Model = doc.constructor;
        const model = Model.modelName;

        try {
            // Find the counter document for this model and field
            const counter = await IdCounter.findOne({ model, field });

            if (!counter) {
                // If the counter document doesn't exist, create it with an initial count of 1
                await IdCounter.create({ model, field, count: 1 });
                doc[field] = 1;
            } else {
                // Increment the count and update the counter document
                counter.count++;
                await counter.save();
                doc[field] = counter.count;
            }
        } catch (err) {
            return next(err);
        }

        return next();
    };
};

