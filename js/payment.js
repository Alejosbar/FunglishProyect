// Payment JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const paymentBtns = document.querySelectorAll('.payment-btn');
    const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
    const paymentForm = document.getElementById('paymentForm');
    const confirmPaymentBtn = document.getElementById('confirmPayment');
    let selectedPlan = ''; // Variable para guardar el plan seleccionado

    if (paymentBtns) {
        paymentBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                selectedPlan = this.dataset.plan; // Capturamos el plan desde el data-attribute
                paymentModal.show();
            });
        });
    }

    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', function() {
            if (validatePaymentForm()) {
                processPayment();
            }
        });
    }

    function validatePaymentForm() {
        const cardNumber = document.getElementById('cardNumber').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        const cardName = document.getElementById('cardName').value;

        // Basic validation
        if (!cardNumber || cardNumber.length < 16) {
            alert('Por favor ingrese un número de tarjeta válido');
            return false;
        }

        if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
            alert('Por favor ingrese una fecha de expiración válida (MM/YY)');
            return false;
        }

        if (!cvv || cvv.length < 3) {
            alert('Por favor ingrese un CVV válido');
            return false;
        }

        if (!cardName.trim()) {
            alert('Por favor ingrese el nombre en la tarjeta');
            return false;
        }

        return true;
    }

    function processPayment() {
        // Simulate payment processing
        confirmPaymentBtn.disabled = true;
        confirmPaymentBtn.textContent = 'Procesando...';

        setTimeout(() => {
            // Simulate success
            paymentModal.hide();

            // Guardar la información de la suscripción
            const today = new Date();
            const expirationDate = new Date(today);
            expirationDate.setMonth(today.getMonth() + 1); // La suscripción vence en 1 mes

            const subscriptionData = {
                type: selectedPlan,
                startDate: today.toLocaleDateString('es-CO'),
                expirationDate: expirationDate.toLocaleDateString('es-CO')
            };

            localStorage.setItem('funenglish_subscription', JSON.stringify(subscriptionData));

            showPaymentSuccess();
            confirmPaymentBtn.disabled = false;
            confirmPaymentBtn.textContent = 'Confirmar Pago';
            paymentForm.reset();
        }, 2000);
    }

    function showPaymentSuccess() {
        const successModal = new bootstrap.Modal(document.getElementById('successModal') || createSuccessModal());
        successModal.show();
    }

    function createSuccessModal() {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'successModal';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Pago Exitoso</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <div class="mb-3">
                            <span style="font-size: 3rem;">✅</span>
                        </div>
                        <h4>¡Pago procesado exitosamente!</h4>
                        <p>Gracias por suscribirte a FUNGLISH. Tu acceso premium está activado.</p>
                        <p><strong>Recibo #${Math.random().toString(36).substr(2, 9).toUpperCase()}</strong></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Comenzar</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    // Additional payment methods simulation
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            paymentMethods.forEach(m => m.classList.remove('active'));
            this.classList.add('active');

            // In a real implementation, you would switch payment forms based on method
            console.log('Selected payment method:', this.dataset.method);
        });
    });

    // Auto-format card number
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = value;
        });
    }

    // Auto-format expiry date
    const expiryInput = document.getElementById('expiryDate');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }

    // CVV validation
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
        });
    }

    // Simulate integration with payment gateways
    function simulateGatewayIntegration(gateway) {
        return new Promise((resolve, reject) => {
            // Simulate API call
            setTimeout(() => {
                if (Math.random() > 0.1) { // 90% success rate
                    resolve({ success: true, transactionId: Math.random().toString(36).substr(2, 9) });
                } else {
                    reject({ success: false, error: 'Payment gateway error' });
                }
            }, 1000);
        });
    }

    // Enhanced payment processing with gateway simulation
    async function processPaymentWithGateway() {
        try {
            const result = await simulateGatewayIntegration('payu');
            if (result.success) {
                console.log('Payment successful:', result.transactionId);
                return true;
            }
        } catch (error) {
            console.error('Payment failed:', error);
            alert('Error en el procesamiento del pago. Por favor intente nuevamente.');
            return false;
        }
    }

    // Update the processPayment function to use gateway simulation
    const originalProcessPayment = processPayment;
    processPayment = async function() {
        if (!validatePaymentForm()) return;

        confirmPaymentBtn.disabled = true;
        confirmPaymentBtn.textContent = 'Procesando...';

        const success = await processPaymentWithGateway();
        if (success) {
            paymentModal.hide();
            showPaymentSuccess();
        }

        confirmPaymentBtn.disabled = false;
        confirmPaymentBtn.textContent = 'Confirmar Pago';
    };
});