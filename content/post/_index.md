---
title: ""
---

<div id="contribution-graph"></div>

<style>
#contribution-graph {
    padding: 20px;
    overflow-x: auto;
}
.graph-container {
    display: inline-block;
}
.graph-title {
    font-size: 14px;
    color: var(--card-text-color-main);
    margin-bottom: 10px;
}
.graph-row {
    display: flex;
    gap: 3px;
    margin-bottom: 3px;
}
.graph-cell {
    width: 11px;
    height: 11px;
    background: var(--card-background);
    border-radius: 2px;
    position: relative;
    cursor: pointer;
}
.graph-cell.level-0 { background: var(--card-background); }
.graph-cell.level-1 { background: #0e4429; }
.graph-cell.level-2 { background: #006d32; }
.graph-cell.level-3 { background: #26a641; }
.graph-cell.level-4 { background: #39d353; }
.graph-cell:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    padding: 4px 8px;
    background: rgba(0,0,0,0.8);
    color: white;
    font-size: 12px;
    white-space: nowrap;
    border-radius: 3px;
    margin-bottom: 5px;
    z-index: 1000;
}
.graph-months {
    display: flex;
    gap: 3px;
    margin-bottom: 5px;
    padding-left: 20px;
}
.graph-month {
    font-size: 10px;
    color: var(--card-text-color-tertiary);
    width: 55px;
}
.graph-days {
    display: flex;
    flex-direction: column;
    gap: 3px;
    margin-right: 5px;
}
.graph-day-label {
    height: 11px;
    font-size: 9px;
    color: var(--card-text-color-tertiary);
    line-height: 11px;
}
.graph-content {
    display: flex;
}
.graph-weeks {
    display: flex;
    gap: 3px;
}
.graph-legend {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 10px;
    font-size: 11px;
    color: var(--card-text-color-tertiary);
}
.graph-legend-item {
    width: 11px;
    height: 11px;
    border-radius: 2px;
}
</style>

<script>
(async function() {
    const response = await fetch('/index.json');
    const posts = await response.json();
    
    const postDates = {};
    posts.forEach(post => {
        const date = post.date.split('T')[0];
        postDates[date] = (postDates[date] || 0) + 1;
    });
    
    const container = document.getElementById('contribution-graph');
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);
    
    let html = '<div class="graph-container">';
    html += '<div class="graph-title">文章发布活动</div>';
    html += '<div class="graph-months">';
    
    const months = [];
    for (let i = 0; i < 52; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i * 7);
        const month = d.toLocaleDateString('zh-CN', { month: 'short' });
        if (i === 0 || months[months.length - 1] !== month) {
            months.push(month);
            html += `<div class="graph-month">${month}</div>`;
        }
    }
    html += '</div>';
    
    html += '<div class="graph-content">';
    html += '<div class="graph-days">';
    ['一', '三', '五'].forEach((day, i) => {
        html += `<div class="graph-day-label">${i === 0 ? '周' + day : i === 1 ? day : day}</div>`;
        if (i < 2) html += '<div class="graph-day-label"></div>';
    });
    html += '</div>';
    
    html += '<div class="graph-weeks">';
    
    for (let week = 0; week < 53; week++) {
        html += '<div class="graph-week">';
        for (let day = 0; day < 7; day++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + week * 7 + day);
            
            if (currentDate > today) {
                html += '<div class="graph-cell"></div>';
                continue;
            }
            
            const dateStr = currentDate.toISOString().split('T')[0];
            const count = postDates[dateStr] || 0;
            const level = count === 0 ? 0 : Math.min(Math.ceil(count / 1), 4);
            const tooltip = `${dateStr}: ${count} 篇文章`;
            
            html += `<div class="graph-cell level-${level}" data-tooltip="${tooltip}"></div>`;
        }
        html += '</div>';
    }
    
    html += '</div></div>';
    html += '<div class="graph-legend">';
    html += '<span>少</span>';
    for (let i = 0; i <= 4; i++) {
        html += `<div class="graph-legend-item level-${i}"></div>`;
    }
    html += '<span>多</span>';
    html += '</div>';
    html += '</div>';
    
    container.innerHTML = html;
})();
</script>
