function renderAssets() {
    const assetNames = getAssetNames();
    let html = '';
    
    // Initialize inputValues if needed
    if (Object.keys(inputValues).length === 0) {
        assetNames.forEach(name => {
            inputValues[name] = { dollar: 0, percent: 0 };
        });
    }
    
    for (let name of assetNames) {
        const isCash = name === 'Cash';
        const dollarVal = inputValues[name]?.dollar || 0;
        const percentVal = inputValues[name]?.percent || 0;
        
        let inputFields = '';
        
        if (currentMode === 'dollar') {
            inputFields = `
                <div class="input-group">
                    <span class="dollar-symbol">$</span>
                    <input type="number" step="0.01" min="0" data-asset="${name}" data-field="dollar" value="${fmt(dollarVal)}" placeholder="0.00">
                </div>
            `;
        } else if (currentMode === 'percent') {
            inputFields = `
                <div class="input-group">
                    <input type="number" step="0.1" min="0" max="100" data-asset="${name}" data-field="percent" value="${percentVal.toFixed(1)}" placeholder="0.0">
                    <span class="percent-symbol">%</span>
                </div>
            `;
        } else { // both mode
            inputFields = `
                <div class="input-group">
                    <span class="dollar-symbol">$</span>
                    <input type="number" step="0.01" min="0" data-asset="${name}" data-field="dollar" value="${fmt(dollarVal)}" placeholder="0.00">
                    <span class="or-text">or</span>
                    <input type="number" step="0.1" min="0" max="100" data-asset="${name}" data-field="percent" value="${percentVal.toFixed(1)}" placeholder="0.0">
                    <span class="percent-symbol">%</span>
                </div>
            `;
        }
        
        html += `
            <div class="asset-item">
                <span class="label">${name}</span>
                <span class="hidden-badge">${isCash ? '💵 cash' : '🔒 hidden'}</span>
                ${inputFields}
            </div>
        `;
    }
    
    // Set the HTML content
    assetGrid.innerHTML = html;
    
    // Re-attach event listeners to ALL inputs
    document.querySelectorAll('.asset-item input').forEach(inp => {
        const name = inp.dataset.asset;
        const field = inp.dataset.field;
        
        // Initialize inputs object if needed
        if (!inputs[name]) {
            inputs[name] = {};
        }
        inputs[name][field] = inp;
        
        // Remove any existing listeners by cloning and replacing
        const newInp = inp.cloneNode(true);
        inp.parentNode.replaceChild(newInp, inp);
        
        // Add fresh event listener to the new input
        newInp.addEventListener('input', function(e) {
            const assetName = this.dataset.asset;
            const fieldName = this.dataset.field;
            let val = parseFloat(this.value);
            if (isNaN(val) || val < 0) val = 0;
            
            if (fieldName === 'dollar') {
                if (val > capital) {
                    this.classList.add('error');
                } else {
                    this.classList.remove('error');
                }
                inputValues[assetName].dollar = val;
                if (currentMode === 'both') {
                    const pct = capital > 0 ? (val / capital) * 100 : 0;
                    inputValues[assetName].percent = pct;
                    // Update the percent field if it exists
                    const pctInput = inputs[assetName]?.percent;
                    if (pctInput && pctInput !== this) {
                        pctInput.value = pct.toFixed(1);
                    }
                }
            } else if (fieldName === 'percent') {
                if (val > 100) {
                    this.classList.add('error');
                } else {
                    this.classList.remove('error');
                }
                inputValues[assetName].percent = val;
                if (currentMode === 'both') {
                    const dollarAmt = (val / 100) * capital;
                    inputValues[assetName].dollar = dollarAmt;
                    const dollarInput = inputs[assetName]?.dollar;
                    if (dollarInput && dollarInput !== this) {
                        dollarInput.value = fmt(dollarAmt);
                    }
                }
            }
            
            refreshUI();
        });
        
        newInp.addEventListener('blur', function() {
            let val = parseFloat(this.value);
            if (isNaN(val) || val < 0) val = 0;
            if (this.dataset.field === 'dollar') {
                this.value = fmt(val);
            } else {
                this.value = val.toFixed(1);
            }
            refreshUI();
        });
        
        // Update the inputs reference to point to the new element
        inputs[name][field] = newInp;
    });
    
    refreshUI();
}
