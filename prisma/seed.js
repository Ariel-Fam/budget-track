const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    await prisma.expense.createMany({
        data: [
            { amount: 54.99, category: "Groceries", description: "Supermarket run", iconKey: "shopping-bag" },
            { amount: 120.0, category: "Utilities", description: "Electricity bill", iconKey: "bolt" },
            { amount: 15.5, category: "Transport", description: "Bus pass", iconKey: "bus" },
            { amount: 39.99, category: "Entertainment", description: "Streaming", iconKey: "clapperboard" },
        ],
    });

    await prisma.saving.createMany({
        data: [
            { amount: 500, note: "Emergency fund", iconKey: "piggy-bank" },
            { amount: 250, note: "Vacation", iconKey: "plane" },
        ],
    });

    await prisma.investment.createMany({
        data: [
            { amount: 1000, instrument: "ETF - VOO", note: "Monthly DCA", iconKey: "line-chart" },
            { amount: 750, instrument: "TFSA - Stocks", note: "Canadian equities", iconKey: "maple" },
        ],
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });


