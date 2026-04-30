const Review = require('../models/Review');
const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// GET ALL REVIEWS
// GET /api/reviews
const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ userId: req.user._id }).sort({ date: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: '❌ Server error', error: error.message });
    }
};

// DRAFT AI REPLY
// POST /api/reviews/:id/draft
const draftReply = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });
        if (review.userId.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

        if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'paste_your_groq_key_here') {
            const offlineMessage = "🚨 Your AI is currently offline on the live server. Please add GROQ_API_KEY to your Render Environment Variables and trigger a Manual Deploy.";
            review.aiDraft = offlineMessage;
            await review.save();
            return res.json({ success: true, draft: offlineMessage });
        }

        const systemPrompt = `You are an expert customer service AI representing an Ecommerce Brand.
A customer has left a review on ${review.platform}.
Rating: ${review.rating}/5
Customer Name: ${review.author}
Review Content: "${review.content}"

Draft a polite, professional, and empathetic response to this review. 
If it is a negative review, apologize, validate their concern, and offer to make it right (e.g., "please contact our support team").
If it is a positive review, thank them warmly.
Do NOT include placeholders like [Your Name] or [Company Name], just write the response text naturally so the brand owner can send it immediately. Keep it under 4 sentences.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "system", content: systemPrompt }],
            model: "llama-3.1-8b-instant",
            temperature: 0.7,
            max_tokens: 250,
        });

        const draft = chatCompletion.choices[0].message.content.trim();
        
        // Save draft to DB
        review.aiDraft = draft;
        await review.save();

        res.json({ success: true, draft });
    } catch (error) {
        review.aiDraft = `❌ AI Error: ${error.message}. (If you just added the key on Render, you MUST click 'Manual Deploy' for it to take effect!)`;
        await review.save();
        res.status(500).json({ success: false, message: error.message });
    }
};

// APPROVE REPLY
// PUT /api/reviews/:id/reply
const approveReply = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });
        if (review.userId.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

        review.status = 'replied';
        await review.save();

        res.json({ success: true, message: 'Review marked as replied' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// SEED DUMMY DATA FOR DEMO
// POST /api/reviews/seed
const seedReviews = async (req, res) => {
    try {
        await Review.deleteMany({ userId: req.user._id }); // clear existing
        
        const dummyReviews = [
            {
                userId: req.user._id, platform: 'Amazon', author: 'John D.', rating: 1, 
                content: 'Terrible experience. The package arrived 4 days late and the box was completely crushed. Inside, the product had a huge scratch.', 
                sentiment: 'negative', status: 'pending', date: new Date()
            },
            {
                userId: req.user._id, platform: 'Shopify', author: 'Sarah W.', rating: 5, 
                content: 'Absolutely love this! The quality is amazing and it looks exactly like the pictures. Will definitely be buying more from you guys.', 
                sentiment: 'positive', status: 'pending', date: new Date(Date.now() - 86400000)
            },
            {
                userId: req.user._id, platform: 'Trustpilot', author: 'Mike T.', rating: 3, 
                content: 'It works fine, but I think it is a bit overpriced for what it is. Customer service was helpful when I had a question though.', 
                sentiment: 'neutral', status: 'pending', date: new Date(Date.now() - 172800000)
            },
            {
                userId: req.user._id, platform: 'Google', author: 'Emily R.', rating: 2, 
                content: 'The color is completely different from what is shown on the website. I ordered navy blue and got something that looks almost black. Very disappointed.', 
                sentiment: 'negative', status: 'pending', date: new Date(Date.now() - 259200000)
            },
            {
                userId: req.user._id, platform: 'Amazon', author: 'David L.', rating: 4, 
                content: 'Good product overall. Setup was a bit tricky but once I got it working it has been great.', 
                sentiment: 'positive', status: 'pending', date: new Date(Date.now() - 345600000)
            }
        ];

        await Review.insertMany(dummyReviews);
        res.json({ success: true, message: 'Successfully seeded 5 dummy reviews' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getReviews, draftReply, approveReply, seedReviews };
