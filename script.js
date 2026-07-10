(function() {
    // ----- SET A: Fear vs Opportunity -----
    const ROUNDS_DATA = [
        { year: "2008", label: "Financial crisis", returns: { "USA Eq": -37.0, "Europe Eq": -45.0, "Japan Eq": -42.1, "China Eq": -51.0, "USA FI": 5.2, "Europe FI": 6.1, "Japan FI": 3.4, "China FI": 9.0, "Cash": 1.4 } },
        { year: "2017", label: "Growth optimism", returns: { "USA Eq": 21.8, "Europe Eq": 25.0, "Japan Eq": 19.1, "China Eq": 54.0, "USA FI": 3.5, "Europe FI": 0.6, "Japan FI": 0.2, "China FI": -1.2, "Cash": 0.8 } },
        { year: "2020", label: "Pandemic shock", returns: { "USA Eq": 18.4, "Europe Eq": 5.0, "Japan Eq": 16.0, "China Eq": 30.0, "USA FI": 7.5, "Europe FI": 4.1, "Japan FI": 0.7, "China FI": 3.5, "Cash": 0.5 } },
        { year: "2012", label: "Stabilisation", returns: { "USA Eq": 16.0, "Europe Eq": 19.0, "Japan Eq": 22.9, "China Eq": 19.0, "USA FI": 4.2, "Europe FI": 10.3, "Japan FI": 1.8, "China FI": 4.0, "Cash": 0.1 } },
        { year: "2022", label: "Inflation & tightening", returns: { "USA Eq": -18.1, "Europe Eq": -15.0, "Japan Eq": -9.4, "China Eq": -22.0, "USA FI": -13.0, "Europe FI": -17.2, "Japan FI": -5.3, "China FI": 3.1, "Cash": 1.5 } },
        { year: "2009", label: "Recovery or trap", returns: { "USA Eq": 26.5, "Europe Eq": 32.0, "Japan Eq": 19.0, "China Eq": 62.0, "USA FI": 5.9, "Europe FI": 5.6, "Japan FI": 1.4, "China FI": 1.4, "Cash": 0.1 } },
        { year: "2024", label: "Momentum vs diversification", returns: { "USA Eq": 25.0, "Europe Eq": 9.0, "Japan Eq": 19.2, "China Eq": 20.0, "USA FI": 1.2, "Europe FI": 1.8, "Japan FI": -2.0, "China FI": 5.5, "Cash": 5.1 } }
    ];

    let currentRound = 0;
    let capital = 10000.0;
    let history = [];

    // DOM refs
    const roundLabel = document.getElementById('roundLabel');
    const yearTag = document.getElementById('yearTag');
    const capitalDisplay = document.getElementById('capitalDisplay');
    const remainingDisplay = document.getElementById('remainingDisplay');
    const assetGrid = document.getElementById('assetGrid');
    const globalError = document.getElementById('globalError');
    const allocatedSumDisplay = document.getElementById('allocatedSumDisplay');
    const submitBtn = document.getElementById('submitRoundBtn');
    const resetBtn = document.getElementById('resetRoundBtn');
    const resultBlock = document.getElementById('resultBlock');
    const returnAmountDisplay = document.getElementById('returnAmountDisplay');
    const returnPercentDisplay = document.getElementById('returnPercentDisplay');
    const newCapitalDisplay = document.getElementById('newCapitalDisplay');
    const historyEntries = document.getElementById('historyEntries');
    const detailTableWrap = document.getElementById('detailTableWrap');
    const detailBody = document.getElementById('detailBody');
    const reflectionText = document.getElementById('reflectionText');

    let inputs = {};

    function fmt(v) { return Number(v).toFixed(2); }
    function getRoundData() { return ROUNDS_DATA[currentRound]; }
    function getAssetNames() { return Object.keys(getRoundData().returns); }

    function refreshUI() {
        capitalDisplay.textContent = fmt(capital);
        let sum = 0;
        const assetNames = getAssetNames();
        for (let name of assetNames) {
            const inp = inputs[name];
            if (!inp) continue;
            let val = parseFloat(inp.value);
            if (isNaN(val) || val < 0) val = 0;
            sum += val;
            if (val > capital) inp.classList.add('error');
            else inp.classList.remove('error');
        }
        const remaining = Math.max(0, capital - sum);
        remainingDisplay.textContent = fmt(remaining);
        allocatedSumDisplay.textContent = fmt(sum);

        let errorMsg = '';
        for (let name of assetNames) {
            const inp = inputs[name];
            if (!inp) continue;
            let val = parseFloat(inp.value);
            if (!isNaN(val) && val > capital) {
                errorMsg = `⚠️ ${name} exceeds available capital (${fmt(capital)}).`;
                break;
            }
        }
        if (sum > capital) {
            errorMsg = errorMsg || `⚠️ Total allocation (${fmt(sum)}) exceeds capital (${fmt(capital)}).`;
        }
        globalError.textContent = errorMsg;
        submitBtn.disabled = (errorMsg.length > 0 || sum === 0);
    }

    function renderAssets() {
        const assetNames = getAssetNames();
        let html = '';
        for (let name of assetNames) {
            html += `
                <div class="asset-item">
                    <span class="label">${name}</span>
                    <span class="hidden-badge">🔒 hidden</span>
                    <input type="number" step="0.01" min="0" data-asset="${name}" value="0.00">
                </div>
            `;
        }
        assetGrid.innerHTML = html;
        inputs = {};
        document.querySelectorAll('.asset-item input').forEach(inp => {
            const name = inp.dataset.asset;
            inputs[name] = inp;
            inp.addEventListener('input', refreshUI);
            inp.addEventListener('blur', function() {
                let val = parseFloat(this.value);
                if (isNaN(val) || val < 0) val = 0;
                this.value = fmt(val);
                refreshUI();
            });
        });
        refreshUI();
    }

    function resetInputs() {
        const assetNames = getAssetNames();
        for (let name of assetNames) {
            if (inputs[name]) {
                inputs[name].value = '0.00';
                inputs[name].classList.remove('error');
            }
        }
        refreshUI();
    }

    function renderDetailTable(allocationMap, returnsMap, totalCapital) {
        const assetNames = getAssetNames();
        let rows = '';
        let totalAllocPct = 0, totalAllocDol = 0, totalEndVal = 0;
        for (let name of assetNames) {
            const allocDol = allocationMap[name] || 0;
            const allocPct = totalCapital > 0 ? (allocDol / totalCapital) * 100 : 0;
            const ret = returnsMap[name] || 0;
            const endVal = allocDol * (1 + ret / 100);
            totalAllocPct += allocPct;
            totalAllocDol += allocDol;
            totalEndVal += endVal;
            const retStr = ret >= 0 ? `+${fmt(ret)}` : fmt(ret);
            rows += `
                <tr>
                    <td class="asset-label">${name}</td>
                    <td>${fmt(allocPct)}%</td>
                    <td>${fmt(allocDol)}</td>
                    <td>${retStr}%</td>
                    <td>${fmt(endVal)}</td>
                </tr>
            `;
        }
        rows += `
            <tr class="total-row">
                <td class="asset-label"><strong>TOTAL</strong></td>
                <td>${fmt(totalAllocPct)}%</td>
                <td>${fmt(totalAllocDol)}</td>
                <td>—</td>
                <td><strong>${fmt(totalEndVal)}</strong></td>
            </tr>
        `;
        detailBody.innerHTML = rows;
        detailTableWrap.style.display = 'block';
    }

    function submitAllocation() {
        const assetNames = getAssetNames();
        const returns = getRoundData().returns;
        let allocated = 0;
        let allocationMap = {};
        let error = false;

        for (let name of assetNames) {
            const inp = inputs[name];
            let val = parseFloat(inp.value);
            if (isNaN(val) || val < 0) val = 0;
            if (val > capital) error = true;
            allocated += val;
            allocationMap[name] = val;
        }
        if (error || allocated > capital || allocated === 0) {
            globalError.textContent = error ? '⚠️ Allocation exceeds capital.' : '⚠️ Allocate at least some capital.';
            return;
        }

        let totalReturn = 0;
        for (let name of assetNames) {
            const ret = returns[name] / 100;
            totalReturn += allocationMap[name] * ret;
        }
        const returnPercent = (totalReturn / capital) * 100;
        const newCapital = capital + totalReturn;

        // REVEAL the year and returns
        const data = getRoundData();
        yearTag.textContent = `${data.year} · ${data.label}`;

        history.push({
            round: currentRound + 1,
            year: data.year,
            allocation: { ...allocationMap },
            returnAmount: totalReturn,
            returnPercent: returnPercent,
            newCapital: newCapital
        });

        // Save to localStorage for other pages
        localStorage.setItem('gameHistory', JSON.stringify(history));
        localStorage.setItem('currentCapital', newCapital.toString());

        resultBlock.style.display = 'block';
        returnAmountDisplay.textContent = (totalReturn >= 0 ? '+' : '') + fmt(totalReturn);
        returnPercentDisplay.textContent = fmt(returnPercent) + '%';
        newCapitalDisplay.textContent = fmt(newCapital);

        // SHOW the detailed table with all returns
        renderDetailTable(allocationMap, returns, capital);
        reflectionText.textContent = 'What surprised you? What would you change next round?';

        capital = newCapital;

        if (currentRound < ROUNDS_DATA.length - 1) {
            currentRound++;
            updateRoundHeader();
            renderAssets();
            resultBlock.style.display = 'none';
            detailTableWrap.style.display = 'none';
            renderHistory();
            globalError.textContent = '';
        } else {
            submitBtn.disabled = true;
            submitBtn.textContent = '🏁 Game Over';
            globalError.textContent = '🎉 All 7 rounds completed! Check your final capital above.';
            renderHistory();
        }
        refreshUI();
    }

    function updateRoundHeader() {
        const data = getRoundData();
        roundLabel.textContent = `Round ${currentRound + 1}`;
        yearTag.textContent = `??? · Hidden year`;
    }

    function renderHistory() {
        if (history.length === 0) {
            historyEntries.innerHTML = `<span style="color:#4d6f8b;">— allocations & results will appear here</span>`;
            return;
        }
        let html = '';
        for (let h of history) {
            const allocStr = Object.entries(h.allocation)
                .filter(([k,v]) => v > 0)
                .map(([k,v]) => `${k}: ${fmt(v)}`)
                .join(' · ');
            html += `
                <div class="entry">
                    <span class="tag">R${h.round} (${h.year})</span>
                    <span>💰 ${fmt(h.returnAmount)} (${fmt(h.returnPercent)}%)</span>
                    <span>🔁 capital: ${fmt(h.newCapital)}</span>
                    <span style="font-size:0.8rem; color:#2b577a;">${allocStr}</span>
                </div>
            `;
        }
        historyEntries.innerHTML = html;
    }

    function resetRound() {
        resetInputs();
        resultBlock.style.display = 'none';
        detailTableWrap.style.display = 'none';
        globalError.textContent = '';
        submitBtn.disabled = false;
        // Reset year tag back to hidden
        const data = getRoundData();
        yearTag.textContent = `??? · Hidden year`;
        if (currentRound === ROUNDS_DATA.length - 1 && history.length === ROUNDS_DATA.length) {
            submitBtn.disabled = true;
            submitBtn.textContent = '🏁 Game Over';
        } else {
            submitBtn.textContent = '✅ Done — reveal returns';
        }
    }

    function init() {
        currentRound = 0;
        capital = 10000.0;
        history = [];
        updateRoundHeader();
        renderAssets();
        renderHistory();
        resultBlock.style.display = 'none';
        detailTableWrap.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.textContent = '✅ Done — reveal returns';
        globalError.textContent = '';
        refreshUI();
    }

    submitBtn.addEventListener('click', submitAllocation);
    resetBtn.addEventListener('click', resetRound);
    init();
})();
