const Groq = require('groq-sdk');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Account = require('../models/Account');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Helper to get user financial data
const getUserFinancialData = async (userId) => {
    const [transactions, budgets, accounts] = await Promise.all([
        Transaction.find({ userId }).sort({ date: -1 }).limit(50),
        Budget.find({ userId }),
        Account.find({ userId })
    ]);

    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = totalIncome > 0
        ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)
        : 0;

    const categorySpending = {};
    transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
            const cat = t.category || 'Other';
            categorySpending[cat] = (categorySpending[cat] || 0) + t.amount;
        });

    return {
        transactions,
        budgets,
        accounts,
        totalBalance,
        totalIncome,
        totalExpenses,
        savingsRate,
        categorySpending
    };
};

// @desc    Ask AI Advisor
// @route   POST /api/ai/ask
// @access  Private
const askAI = async (req, res) => {
    try {
        const { question } = req.body;

        // Check if the user has actually configured their Groq API Key
        if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'paste_your_groq_key_here') {
            return res.json({ 
                success: true, 
                answer: "🚨 Your AI is currently offline. Please paste your actual Groq API Key into the `backend/.env` file and restart the server to activate me!" 
            });
        }

        // Fetch their real financial data to use as AI context
        const financialData = await getUserFinancialData(req.user._id);
        
        const systemPrompt = `You are NiveshAI, a highly intelligent and friendly Personal Finance Advisor. 
You have access to the user's latest financial data context. Use this context to answer their questions accurately.

Data Context:
Total Balance: ₹${financialData.totalBalance}
Total Income: ₹${financialData.totalIncome}
Total Expenses: ₹${financialData.totalExpenses}
Savings Rate: ${financialData.savingsRate}%
Top Category Spending: ${JSON.stringify(financialData.categorySpending)}

Keep your responses concise, actionable, and warm. Use bullet points if necessary. NEVER invent random numbers.`;

        // Process request through Groq Llama 3
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: question || "Can you give me a financial summary?" }
            ],
            model: "llama-3.1-8b-instant", // Updated to a currently supported fast model
            temperature: 0.6,
            max_tokens: 500,
        });

        res.json({ success: true, answer: chatCompletion.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get AI Insights
// @route   GET /api/ai/insights
// @access  Private
const getInsights = async (req, res) => {
    try {
        res.json({ success: true, insights: [] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { askAI, getInsights };
