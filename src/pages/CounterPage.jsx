import React, { useState } from 'react';

const CounterPage = () => {
    const [addCount, setAddCount] = useState(0);
    const [mulCount, setMulCount] = useState(1);
    const [subCount, setSubCount] = useState(0);

    return (
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '2rem' }}>
            <div
                style={{ padding: '2rem', border: '1px solid #ccc', cursor: 'pointer', textAlign: 'center' }}
                onClick={() => setAddCount(addCount + 1)}
            >
                <div>Add by 1</div>
                <div>{addCount}</div>
            </div>
            <div
                style={{ padding: '2rem', border: '1px solid #ccc', cursor: 'pointer', textAlign: 'center' }}
                onClick={() => setMulCount(mulCount / 2)}
            >
                <div>Multiply by 2</div>
                <div>{mulCount}</div>
            </div>
            <div
                style={{ padding: '2rem', border: '1px solid #ccc', cursor: 'pointer', textAlign: 'center' }}
                onClick={() => setSubCount(subCount - 1)}
            >
                <div>Subtract by 1</div>
                <div>{subCount}</div>
            </div>
        </div>
    );
};

export default CounterPage;