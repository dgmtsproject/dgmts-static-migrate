import "./Pricing.css"
const PRICING_PLANS = [
  {
    name: 'Basic Professional',
    price: '$29',
    period: 'per month',
    features: [
      'Single user license',
      'Unlimited projects',
      'Standard PDF exports',
      'Email support',
      'Cloud data backup'
    ]
  },
  {
    name: 'Enterprise Fleet',
    price: '$199',
    period: 'per month',
    isPopular: true,
    features: [
      'Up to 10 users',
      'Unlimited projects',
      'Custom PDF branding',
      'CSV Raw Data exports',
      'Priority 24/7 support',
      'Team collaboration tools'
    ]
  },
  {
    name: 'Government/Large Scale',
    price: 'Custom',
    period: 'quote',
    features: [
      'Unlimited users',
      'On-premise deployment options',
      'Dedicated account manager',
      'API access for integration',
      'Customized feature requests'
    ]
  }
];

const Pricing = () => {
  return (
    <div className="pricing-section">
      <div className="section-header">
        <h2 className="section-subtitle">Pricing</h2>
        <h3 className="section-title">Choose the Plan That Works for You</h3>
        <p className="section-description">
          From independent engineers to global firms, we have a solution that scales with your project needs.
        </p>
      </div>
      
      <div className="pricing-grid">
        {PRICING_PLANS.map((plan) => (
          <div key={plan.name} className={`pricing-card ${plan.isPopular ? 'popular' : ''}`}>
            {plan.isPopular && <div className="popular-badge">Most Popular</div>}
            
            <div className="pricing-header">
              <h4 className="plan-name">{plan.name}</h4>
              <div className="plan-price">
                <span className="price-amount">{plan.price}</span>
                <span className="price-period">/ {plan.period}</span>
              </div>
            </div>
            
            <ul className="plan-features">
              {plan.features.map((feature) => (
                <li key={feature}>
                  <div className="feature-check">
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <button className={`plan-button ${plan.isPopular ? 'primary' : ''}`}>
              {plan.price === 'Custom' ? 'Contact Sales' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing