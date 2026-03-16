const { GoogleGenerativeAI } = require('@google/generative-ai');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Account = require('../models/Account');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const askAI = async (req, res) => {
    const { question } = req.body;

    try {
        if (!question) {
            return res.status(400).json({
                message: '❌ Please provide a question'
            });
        }

        // Get user's financial data
        const [transactions, budgets, accounts] = await Promise.all([
            Transaction.find({ userId: req.user._id })
                .sort({ date: -1 })
                .limit(50),
            Budget.find({ userId: req.user._id }),
            Account.find({ userId: req.user._id })
        ]);

        // Calculate summary
        const totalBalance = accounts.reduce(
            (sum, acc) => sum + acc.balance, 0
        );
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        // Category spending
        const categorySpending = {};
        transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                const cat = t.category || 'Other';
                categorySpending[cat] = 
                    (categorySpending[cat] || 0) + t.amount;
            });

        // Build context for AI
        const financialContext = `
You are NiveshAI, a personal finance advisor for Indian users.
You are helpful, friendly and give practical advice in simple English.
Always use ₹ symbol for Indian Rupees.
Keep responses concise and actionable.

USER FINANCIAL DATA:
- Total Balance: ₹${totalBalance.toLocaleString()}
- Total Income: ₹${totalIncome.toLocaleString()}
- Total Expenses: ₹${totalExpenses.toLocaleString()}
- Savings Rate: ${totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : 0}%

SPENDING BY CATEGORY:
${Object.entries(categorySpending)
    .map(([cat, amt]) => `- ${cat}: ₹${amt.toLocaleString()}`)
    .join('\n')}

BUDGETS:
${budgets.length > 0 
    ? budgets.map(b => 
        `- ${b.category}: ₹${b.monthlyLimit} limit for ${b.month}`
      ).join('\n')
    : '- No budgets set yet'}

RECENT TRANSACTIONS (Last 10):
${transactions.slice(0, 10)
    .map(t => 
        `- ${t.title}: ₹${t.amount} (${t.type}) on ${
            new Date(t.date).toLocaleDateString('en-IN')
        }`
    ).join('\n')}

USER QUESTION: ${question}

Please give helpful, personalized financial advice based on this data.
Keep response under 200 words. Use bullet points where helpful.
        `;

        // Call Gemini API
        const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash' 
});
        const result = await model.generateContent(financialContext);
        const response = result.response.text();

        res.json({
            answer: response,
            message: '✅ AI response generated'
        });

    } catch (error) {
        console.log('AI Error:', error.message);
        res.status(500).json({
            message: '❌ AI service error',
            error: error.message
        });
    }
};

// Get automatic AI insights
const getInsights = async (req, res) => {
    try {
        const [transactions, budgets, accounts] = await Promise.all([
            Transaction.find({ userId: req.user._id })
                .sort({ date: -1 })
                .limit(50),
            Budget.find({ userId: req.user._id }),
            Account.find({ userId: req.user._id })
        ]);

        const totalBalance = accounts.reduce(
            (sum, acc) => sum + acc.balance, 0
        );
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const categorySpending = {};
        transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                const cat = t.category || 'Other';
                categorySpending[cat] = 
                    (categorySpending[cat] || 0) + t.amount;
            });

        const prompt = `
You are NiveshAI, a personal finance advisor for Indian users.

USER FINANCIAL DATA:
- Total Balance: ₹${totalBalance.toLocaleString()}
- Total Income: ₹${totalIncome.toLocaleString()}
- Total Expenses: ₹${totalExpenses.toLocaleString()}
- Savings Rate: ${totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : 0}%

SPENDING BY CATEGORY:
${Object.entries(categorySpending)
    .map(([cat, amt]) => `- ${cat}: ₹${amt.toLocaleString()}`)
    .join('\n')}

BUDGETS:
${budgets.length > 0 
    ? budgets.map(b => 
        `- ${b.category}: ₹${b.monthlyLimit} limit`
      ).join('\n')
    : 'No budgets set'}

Generate exactly 3 financial insights in JSON format like this:
[
  {
    "type": "warning|success|info",
    "title": "Short title",
    "message": "One sentence insight",
    "action": "One sentence action to take"
  }
]
Return ONLY the JSON array, nothing else.
        `;

       const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash' 
});
        
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Parse JSON response
        const cleanJson = responseText
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();
        
        const insights = JSON.parse(cleanJson);

        res.json(insights);

    } catch (error) {
        console.log('Insights Error:', error.message);
        // Return default insights if AI fails
        res.json([
            {
                type: 'info',
                title: 'Welcome to NiveshAI',
                message: 'Add transactions to get AI insights',
                action: 'Start by adding your bank account'
            }
        ]);
    }
};

module.exports = { askAI, getInsights };