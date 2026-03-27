document.addEventListener('DOMContentLoaded', () => {
    //Select Elements
    const openBtn=document.getElementById('openCalc');
    const closeBtn=document.getElementById('closeCalc');
    const modal=document.getElementById('modalOverlay');
    const calcBtn=document.getElementById('calcBtn');

    //Open Modal Logic
    openBtn.onclick=()=>{
        modal.style.display='flex';
    };

    //Close Modal (X Button)
    closeBtn.onclick=()=>{
        modal.style.display='none';
    };

    //Close Modal
    window.onclick=(event)=>{
        if (event.target===modal) {
            modal.style.display='none';
        }
    };

    //HVAC ROI Calculation Logic 
    calcBtn.onclick=()=>{
        const bill=parseFloat(document.getElementById('monthlyBill').value);
        const age=parseFloat(document.getElementById('unitAge').value);
        const years=parseInt(document.getElementById('years').value);
        const resultArea=document.getElementById('resultArea');
        const display=document.getElementById('savingsDisplay');

        if (bill>0 && age>0) {
            let efficiencyImprovement=(age*0.025); 
            if (efficiencyImprovement>0.45) { 
                efficiencyImprovement=0.45; 
            }
            const totalSavings=(bill*12*years)*efficiencyImprovement;
            display.innerHTML= `
                <p style="margin: 0; color: #666;">Total Potential Savings:</p>
                <h3 style="color: #28a745; font-size: 24px; margin: 10px 0;">
                    Rs. ${totalSavings.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                </h3>
                <p style="font-size: 13px; color: #444;">
                    Based on a <strong>${(efficiencyImprovement * 100).toFixed(0)}%</strong> efficiency boost.
                </p>
            `;
            resultArea.style.display='block';
        } else {
            alert("Please enter valid numbers for your bill and unit age.");
        }
    };
});

//Get support button
const modal = document.getElementById('quoteModal');
const overlay = document.getElementById('overlay');
const form = document.getElementById('quoteForm');
const quoteBtn = document.getElementById('quoteBtn');
const closeBtn = document.getElementById('closeBtn');

quoteBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
});

closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const customerData = {
        name: document.getElementById('nameInput').value,
        phone: document.getElementById('phoneInput').value,
        service: document.getElementById('serviceInput').value,
        timestamp: new Date().toISOString()
    };
    
    let existingLeads = JSON.parse(localStorage.getItem('freshAirLeads')) || [];
    
    existingLeads.push(customerData);
    
    localStorage.setItem('freshAirLeads', JSON.stringify(existingLeads));
    
    alert("Our team will connect within 24 hours");
    
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
    form.reset();
});
