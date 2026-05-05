import { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const AIAdvisor = () => {
    const { token } = useAuth();
    const [messages, setMessages] = useState([
        {
            role: 'ai',
            text: `Namaste! 🙏 I'm your NiveshView financial advisor. I can help you with:

- Analyzing your spending patterns
- Suggesting ways to save more
- Answering financial questions
- Budget recommendations

What would you like to know about your finances today?`
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => { scrollToBottom(); }, [messages]);

    const quickQuestions = [
        'How can I save more money?',
        'Which category am I overspending on?',
        'Give me a financial summary',
        'How to improve my savings rate?'
    ];

    const sendMessage = async (question) => {
        const userQuestion = question || input.trim();
        if (!userQuestion) return;

        setMessages(prev => [...prev, {
            role: 'user',
            text: userQuestion
        }]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/ai/ask', { question: userQuestion });
            setMessages(prev => [...prev, {
                role: 'ai',
                text: res.data.answer
            }]);
        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'ai',
                text: '❌ AI service is currently unavailable. Please try again later.',
                error: true
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="page-layout">
            <Sidebar />
            <div className="main-content" style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                padding: '28px'
            }}>
                {/* Header */}
                <div style={{ marginBottom: '24px' }} className="fade-in">
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '6px'
                    }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #34d399, #818cf8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px'
                        }}>✦</div>
                        <h1 style={{
                            fontFamily: 'Syne, sans-serif',
                            fontSize: '22px',
                            fontWeight: '700',
                            color: 'var(--text-primary)',
                            letterSpacing: '-0.3px'
                        }}>AI Advisor</h1>
                        <span className="badge badge-green">
                            Powered by Gemini
                        </span>
                    </div>
                    <p style={{
                        fontSize: '13px',
                        color: 'var(--text-muted)',
                        marginLeft: '48px'
                    }}>
                        Your personal AI-powered financial advisor
                    </p>
                </div>

                {/* Quick Questions */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    marginBottom: '20px'
                }} className="fade-in">
                    {quickQuestions.map((q, i) => (
                        <button
                            key={i}
                            onClick={() => sendMessage(q)}
                            style={{
                                background: 'var(--bg-secondary)',
                                border: '0.5px solid var(--border-light)',
                                borderRadius: '20px',
                                padding: '6px 14px',
                                fontSize: '12px',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontFamily: 'DM Sans, sans-serif'
                            }}
                            onMouseEnter={e => {
                                e.target.style.borderColor = 'var(--accent-green)';
                                e.target.style.color = 'var(--accent-green)';
                            }}
                            onMouseLeave={e => {
                                e.target.style.borderColor = 'var(--border-light)';
                                e.target.style.color = 'var(--text-secondary)';
                            }}
                        >
                            {q}
                        </button>
                    ))}
                </div>

                {/* Messages */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    background: 'var(--bg-secondary)',
                    border: '0.5px solid var(--border)',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                }}>
                    {messages.map((msg, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            justifyContent: msg.role === 'user'
                                ? 'flex-end'
                                : 'flex-start',
                            gap: '10px',
                            alignItems: 'flex-start'
                        }}>
                            {msg.role === 'ai' && (
                                <div style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '8px',
                                    background: 'linear-gradient(135deg, #34d399, #818cf8)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    flexShrink: 0,
                                    marginTop: '2px'
                                }}>✦</div>
                            )}
                            <div style={{
                                maxWidth: '75%',
                                background: msg.role === 'user'
                                    ? 'linear-gradient(135deg, #818cf8, #6366f1)'
                                    : msg.error
                                    ? 'var(--bg-tertiary)'
                                    : 'var(--bg-tertiary)',
                                border: msg.role === 'ai'
                                    ? '0.5px solid var(--border-light)'
                                    : 'none',
                                borderRadius: msg.role === 'user'
                                    ? '12px 12px 4px 12px'
                                    : '12px 12px 12px 4px',
                                padding: '12px 16px',
                                fontSize: '13px',
                                color: msg.role === 'user'
                                    ? 'white'
                                    : msg.error
                                    ? 'var(--accent-red)'
                                    : 'var(--text-primary)',
                                lineHeight: '1.6',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {msg.text}
                            </div>
                            {msg.role === 'user' && (
                                <div style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #34d399, #818cf8)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    color: 'white',
                                    flexShrink: 0,
                                    marginTop: '2px'
                                }}>U</div>
                            )}
                        </div>
                    ))}

                    {/* Loading indicator */}
                    {loading && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <div style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #34d399, #818cf8)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px'
                            }}>✦</div>
                            <div style={{
                                background: 'var(--bg-tertiary)',
                                border: '0.5px solid var(--border-light)',
                                borderRadius: '12px 12px 12px 4px',
                                padding: '12px 16px',
                                display: 'flex',
                                gap: '4px',
                                alignItems: 'center'
                            }}>
                                {[0, 1, 2].map(i => (
                                    <div key={i} style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: 'var(--accent-green)',
                                        animation: 'pulse 1.2s infinite',
                                        animationDelay: `${i * 0.2}s`
                                    }} />
                                ))}
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-end'
                }} className="fade-in">
                    <textarea
                        className="input"
                        placeholder="Ask me anything about your finances..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        rows={1}
                        style={{
                            resize: 'none',
                            flex: 1,
                            lineHeight: '1.5'
                        }}
                    />
                    <button
                        onClick={() => sendMessage()}
                        disabled={loading || !input.trim()}
                        className="btn-primary"
                        style={{
                            width: 'auto',
                            padding: '11px 20px',
                            flexShrink: 0,
                            opacity: loading || !input.trim() ? 0.5 : 1
                        }}
                    >
                        Send ↗
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIAdvisor;
