import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

const Reviews = () => {
    const { accent } = useTheme();
    const [filter, setFilter] = useState('all');
    
    // Mock data for ROI Correlation (Revenue vs Rating)
    const correlationData = [
        { month: 'Jan', revenue: 45000, rating: 4.2 },
        { month: 'Feb', revenue: 52000, rating: 4.4 },
        { month: 'Mar', revenue: 48000, rating: 4.3 },
        { month: 'Apr', revenue: 61000, rating: 4.6 },
        { month: 'May', revenue: 58000, rating: 4.5 },
        { month: 'Jun', revenue: 72000, rating: 4.8 },
    ];
    
    const mockReviews = [
        { id: 1, user: 'Rahul S.', platform: 'Amazon', rating: 5, text: 'Amazing quality! The material feels very premium. Highly recommended.', sentiment: 'Positive', date: '2 hours ago' },
        { id: 2, user: 'Priya K.', platform: 'Flipkart', rating: 2, text: 'The delivery was very slow and the packaging was damaged. Not happy.', sentiment: 'Negative', date: '5 hours ago' },
        { id: 3, user: 'Amit M.', platform: 'Google', rating: 4, text: 'Great product, but slightly expensive compared to others.', sentiment: 'Neutral', date: '1 day ago' },
        { id: 4, user: 'Sneha J.', platform: 'Amazon', rating: 5, text: 'Love the new collection! Perfect fit.', sentiment: 'Positive', date: '2 days ago' },
    ];

    const stats = {
        total: 1248,
        positive: 85,
        neutral: 10,
        negative: 5
    };

    return (
        <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'DM Sans, sans-serif' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div>
                    <div style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Business Intelligence</div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'Syne,sans-serif' }}>Customer Reviews</h1>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={{ padding: '10px 20px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Export Report</button>
                    <button style={{ padding: '10px 20px', background: 'var(--accent-primary)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px var(--purple-glow)' }}>Connect Platform +</button>
                </div>
            </div>

            {/* AI Sentiment Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                <div style={{ background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)', border: '1px solid var(--border)', borderRadius: '20px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(52,211,153,0.1)', border: '4px solid rgba(52,211,153,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>✨</div>
                    <div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>OVERALL SENTIMENT</div>
                        <div style={{ fontSize: '24px', fontWeight: '800', color: '#34d399' }}>Excellent</div>
                    </div>
                </div>
                <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '20px', padding: '24px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>TOTAL REVIEWS</div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' }}>{stats.total.toLocaleString()}</div>
                </div>
                <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '20px', padding: '24px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>POSITIVE</div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#34d399' }}>{stats.positive}%</div>
                </div>
                <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '20px', padding: '24px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>UNRESOLVED</div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#f43f5e' }}>{stats.negative}%</div>
                </div>
            </div>

            {/* Performance Correlation Chart */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '20px', padding: '24px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>Performance Correlation</h3>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>How average rating affects monthly revenue</p>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '11px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }}/> Revenue</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fbbf24' }}/> Avg Rating</div>
                    </div>
                </div>
                <div style={{ height: '240px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={correlationData}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:'var(--text-muted)', fontSize:11}} />
                            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill:'var(--text-muted)', fontSize:11}} tickFormatter={v=>`₹${v/1000}k`} />
                            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill:'var(--text-muted)', fontSize:11}} domain={[0, 5]} />
                            <Tooltip 
                                contentStyle={{background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:'12px', fontSize:'12px'}}
                                itemStyle={{fontWeight:'700'}}
                            />
                            <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            <Line yAxisId="right" type="monotone" dataKey="rating" stroke="#fbbf24" strokeWidth={2} dot={{fill:'#fbbf24', r:4}} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                {['all', 'Amazon', 'Flipkart', 'Google'].map(p => (
                    <button key={p} onClick={() => setFilter(p)} 
                        style={{ padding: '8px 16px', background: filter === p ? 'var(--accent-primary)' : 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '10px', color: filter === p ? 'white' : 'var(--text-muted)', fontSize: '12px', fontWeight: '700', cursor: 'pointer', textTransform: 'capitalize' }}>
                        {p}
                    </button>
                ))}
            </div>

            {/* Review List */}
            <div style={{ display: 'grid', gap: '16px' }}>
                {mockReviews.filter(r => filter === 'all' || r.platform === filter).map(r => (
                    <div key={r.id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', transition: 'transform 0.2s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: 'var(--accent-primary)' }}>{r.user.charAt(0)}</div>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{r.user}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>via <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>{r.platform}</span> · {r.date}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <div style={{ display: 'flex', gap: '2px', marginBottom: '4px' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} style={{ color: i < r.rating ? '#fbbf24' : 'var(--border)', fontSize: '14px' }}>★</span>
                                    ))}
                                </div>
                                <div style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: r.sentiment === 'Positive' ? '#34d399' : r.sentiment === 'Negative' ? '#f43f5e' : '#f59e0b', padding: '2px 8px', borderRadius: '4px', background: r.sentiment === 'Positive' ? 'rgba(52,211,153,0.1)' : r.sentiment === 'Negative' ? 'rgba(244,63,94,0.1)' : 'rgba(245,158,11,0.1)' }}>{r.sentiment}</div>
                            </div>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>{r.text}</p>
                        <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                            <button style={{ padding: '8px 16px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>🤖</span> AI Draft Reply
                            </button>
                            <button style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Mark as Resolved</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reviews;
