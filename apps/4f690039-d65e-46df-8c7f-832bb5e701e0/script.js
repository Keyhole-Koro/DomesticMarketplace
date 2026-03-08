document.addEventListener('DOMContentLoaded', () => {
    initChart();
    initActivities();
});

function initChart() {
    const canvas = document.getElementById('revenueChart');
    const ctx = canvas.getContext('2d');
    
    // Resize canvas to fit container
    function resize() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawChart();
    }

    const data = [320, 450, 410, 600, 780, 850];
    const labels = ['1月', '2月', '3月', '4月', '5月', '6月'];

    function drawChart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const padding = 40;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;
        const maxVal = Math.max(...data) * 1.2;
        
        // Draw Grid lines
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding + (chartHeight / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(canvas.width - padding, y);
            ctx.stroke();
        }

        // Draw Path
        ctx.beginPath();
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        
        data.forEach((val, i) => {
            const x = padding + (chartWidth / (data.length - 1)) * i;
            const y = canvas.height - padding - (val / maxVal) * chartHeight;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Draw Points & Labels
        data.forEach((val, i) => {
            const x = padding + (chartWidth / (data.length - 1)) * i;
            const y = canvas.height - padding - (val / maxVal) * chartHeight;
            
            ctx.fillStyle = '#6366f1';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#64748b';
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(labels[i], x, canvas.height - padding + 20);
        });
    }

    window.addEventListener('resize', resize);
    resize();
}

function initActivities() {
    const activities = [
        { user: '田中 太郎', desc: 'Proプランへアップグレードしました', time: '5分前' },
        { user: '佐藤 健二', desc: '新規アカウントを作成しました', time: '25分前' },
        { user: 'System', desc: 'サーバーバックアップが完了しました', time: '1時間前' },
        { user: '鈴木 美香', desc: 'サポートチケットを発行しました', time: '3時間前' },
        { user: '決済システム', desc: '月次バッチ処理が正常終了しました', time: '5時間前' },
        { user: '伊藤 直樹', desc: 'ダッシュボードを共有しました', time: '昨日' }
    ];

    const list = document.getElementById('activityList');
    list.innerHTML = activities.map(act => `
        <li class="activity-item">
            <div class="activity-header">
                <span class="activity-user">${act.user}</span>
                <span class="activity-time">${act.time}</span>
            </div>
            <div class="activity-desc">${act.desc}</div>
        </li>
    `).join('');
}