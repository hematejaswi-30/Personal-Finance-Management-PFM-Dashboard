import Sidebar from '../components/Sidebar';
import { useState, useEffect } from 'react';
import { getReviews, seedReviews, draftReviewReply, approveReviewReply } from '../services/api';

const ReviewSync = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [draftingId, setDraftingId] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getReviews();
            setReviews(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSeed = async () => {
        try {
            setLoading(true);
            await seedReviews();
            fetchData();
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    const handleDraft = async (id) => {
        try {
            setDraftingId(id);
            await draftReviewReply(id);
            fetchData(); // re-fetch to get the newly saved draft
        } catch (err) {
            console.log(err);
        } finally {
            setDraftingId(null);
        }
    };

    const handleApprove = async (id) => {
        try {
            await approveReviewReply(id);
            fetchData();
        } catch (err) {
            console.log(err);
        }
    };

    const stats = {
        total: reviews.length,
        pending: reviews.filter(r => r.status === 'pending').length,
        negative: reviews.filter(r => r.sentiment === 'negative').length,
    };

    return (
        <div className="page-layout">
            <Sidebar />
            <div className="main-content">
                <div className="header-container fade-in" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '28px'
                }}>
                    <div>
                        <h1 style={{
                            fontFamily: 'Syne, sans-serif',
                            fontSize: '22px',
                            fontWeight: '700',
                            color: 'var(--text-primary)',
                            letterSpacing: '-0.3px'
                        }}>ReviewSync Inbox</h1>
                        <p style={{
                            fontSize: '13px',
                            color: 'var(--text-muted)',
                            marginTop: '4px'
                        }}>
                            Unified Ecommerce Review Management
                        </p>
                    </div>
                    <button
                        onClick={handleSeed}
                        className="btn-secondary"
                        style={{ width: 'auto', padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <span>🌱</span> Seed Demo Reviews
                    </button>
                </div>

                <div className="grid-3 fade-in" style={{ marginBottom: '24px' }}>
                    <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
                        <div style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>{stats.total}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Reviews</div>
                    </div>
                    <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
                        <div style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'Syne, sans-serif', color: 'var(--accent-yellow)' }}>{stats.pending}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Action Required</div>
                    </div>
                    <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
                        <div style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'Syne, sans-serif', color: 'var(--accent-red)' }}>{stats.negative}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Negative Sentiment</div>
                    </div>
                </div>

                <div className="fade-in">
                    {loading ? (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>Loading reviews...</p>
                    ) : reviews.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                            <div style={{ fontSize: '32px', marginBottom: '16px' }}>📥</div>
                            <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Inbox Empty</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>
                                Connect your platforms or click "Seed Demo Reviews" to see the AI in action.
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {reviews.map(review => (
                                <div key={review._id} className="card" style={{
                                    borderLeft: `4px solid ${review.sentiment === 'negative' ? 'var(--accent-red)' : review.sentiment === 'positive' ? 'var(--accent-green)' : 'var(--accent-yellow)'}`,
                                    opacity: review.status === 'replied' ? 0.6 : 1
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <div className="header-container" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span className="badge badge-purple">{review.platform}</span>
                                            <span style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '14px' }}>{review.author}</span>
                                            <span style={{ color: 'var(--accent-yellow)', letterSpacing: '2px', fontSize: '12px' }}>
                                                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                            </span>
                                        </div>
                                        {review.status === 'replied' ? (
                                            <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                ✓ Replied
                                            </span>
                                        ) : (
                                            <span className="badge badge-yellow">Pending</span>
                                        )}
                                    </div>
                                    
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
                                        "{review.content}"
                                    </p>

                                    {review.status === 'pending' && (
                                        <div style={{
                                            background: 'var(--bg-tertiary)',
                                            padding: '16px',
                                            borderRadius: '8px',
                                            border: '0.5px solid var(--border)'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                                <span style={{ fontSize: '16px' }}>🤖</span>
                                                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Auto-Responder</span>
                                            </div>
                                            
                                            {review.aiDraft ? (
                                                <>
                                                    <textarea 
                                                        className="input" 
                                                        style={{ height: '80px', marginBottom: '12px', fontSize: '13px', resize: 'vertical' }}
                                                        defaultValue={review.aiDraft}
                                                    />
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        <button 
                                                            onClick={() => handleApprove(review._id)}
                                                            className="btn-primary" 
                                                            style={{ padding: '8px 16px', fontSize: '12px', width: 'auto' }}>
                                                            Approve & Send
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDraft(review._id)}
                                                            className="btn-secondary" 
                                                            disabled={draftingId === review._id}
                                                            style={{ padding: '8px 16px', fontSize: '12px', width: 'auto' }}>
                                                            {draftingId === review._id ? 'Drafting...' : 'Regenerate'}
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <button 
                                                    onClick={() => handleDraft(review._id)}
                                                    className="btn-primary" 
                                                    disabled={draftingId === review._id}
                                                    style={{ width: 'auto', padding: '8px 16px', fontSize: '13px', background: 'linear-gradient(135deg, #818cf8, #a78bfa)' }}
                                                >
                                                    {draftingId === review._id ? '✨ Thinking...' : '✨ Draft Smart Reply'}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewSync;
