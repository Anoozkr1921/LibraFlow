const calculateFine = (dueDate, returnDate = null) => {

    const FINE_PER_DAY = 10;

    const today = returnDate || new Date();

    if (today <= dueDate) {
        return {
            lateDays: 0,
            fine: 0,
        };
    }

    const difference =
        today.getTime() - dueDate.getTime();

    const lateDays = Math.ceil(
        difference / (1000 * 60 * 60 * 24)
    );

    return {
        lateDays,
        fine: lateDays * FINE_PER_DAY,
    };
};

module.exports = calculateFine;