// Decision scenarios - choices player must make
export const SCENARIOS = [
  {
    id: 'buy_car',
    title: 'New Car Temptation',
    icon: '🚗',
    description: 'Your friends all have nice cars. The dealer offers you a great deal on a brand new BMW. Only $450/month!',
    choices: [
      {
        text: 'Buy the BMW',
        effect: 'Add car loan liability ($25,000, $450/mo)',
        action: (player) => {
          player.addLiability({
            id: 'fancyCar_' + Date.now(),
            name: 'BMW 3 Series',
            icon: '🚗',
            balance: 25000,
            monthlyPayment: 450,
            interestRate: 0.06
          });
          player.stress -= 10;
          return 'You got the BMW! Feels great... for now.';
        }
      },
      {
        text: 'Invest the money instead',
        effect: '+$5,000 to invest, no new debt',
        action: (player) => {
          player.money += 5000;
          player.finIQ += 5;
          return 'Smart move! You invested $5,000 and learned about opportunity cost.';
        }
      },
      {
        text: 'Buy a reliable used car',
        effect: '-$5,000 cash, no monthly payment',
        action: (player) => {
          player.money -= 5000;
          return 'Practical choice. No debt, gets you from A to B.';
        }
      }
    ],
    minFinIQ: 0,
    probability: 0.15
  },
  {
    id: 'got_raise',
    title: 'You Got a Raise!',
    icon: '🎉',
    description: 'Your boss just gave you a $1,000/month raise! What do you do with the extra income?',
    choices: [
      {
        text: 'Upgrade your lifestyle',
        effect: '+$1,000/month expenses',
        action: (player) => {
          player.baseExpenses += 1000;
          player.stress -= 15;
          return 'New apartment, better food, more fun! But expenses went up.';
        }
      },
      {
        text: 'Save the difference',
        effect: '+$1,000/month to savings',
        action: (player) => {
          player.money += 3000;
          return 'You saved the extra. Your future self thanks you.';
        }
      },
      {
        text: 'Invest it all',
        effect: '+$6,000 to invest immediately',
        action: (player) => {
          player.money += 6000;
          player.finIQ += 5;
          return 'You invested the raise. Building wealth!';
        }
      }
    ],
    minFinIQ: 10,
    probability: 0.12
  },
  {
    id: 'side_hustle_offer',
    title: 'Business Partnership Offer',
    icon: '🤝',
    description: 'Your friend wants to start a business with you. They need $10,000 investment for 50% stake.',
    choices: [
      {
        text: 'Invest $10,000',
        effect: '-$10,000, potential business income',
        action: (player) => {
          player.money -= 10000;
          if (Math.random() > 0.4) {
            player.addAsset({
              id: 'partnerBusiness_' + Date.now(),
              name: 'Partnership Business',
              icon: '🤝',
              cost: 10000,
              monthlyIncome: { min: 200, max: 800 },
              category: 'business',
              volatility: 0.25
            });
            return 'The business took off! You now earn passive income.';
          } else {
            return 'The business failed. You lost your investment. Lesson learned.';
          }
        }
      },
      {
        text: 'Decline politely',
        effect: 'No risk, no reward',
        action: (player) => {
          player.finIQ += 3;
          return 'You passed. Sometimes the best deal is no deal.';
        }
      },
      {
        text: 'Counter-offer with less',
        effect: '-$3,000 for 20% stake',
        action: (player) => {
          player.money -= 3000;
          player.addAsset({
            id: 'minorPartner_' + Date.now(),
            name: 'Minor Partnership',
            icon: '🤝',
            cost: 3000,
            monthlyIncome: { min: 50, max: 200 },
            category: 'business',
            volatility: 0.3
          });
          return 'Smart negotiation! Smaller risk, still some reward.';
        }
      }
    ],
    minFinIQ: 20,
    probability: 0.1
  },
  {
    id: 'market_crash',
    title: 'Market Crashing!',
    icon: '📉',
    description: 'The stock market dropped 30%! Everyone is panicking. What do you do?',
    choices: [
      {
        text: 'Sell everything!',
        effect: 'Lose 30% of stock assets',
        action: (player) => {
          const stockAssets = player.assets.filter(a => a.category === 'stocks');
          stockAssets.forEach(a => {
            a.cost = Math.floor(a.cost * 0.7);
            a.monthlyIncome.min = Math.floor(a.monthlyIncome.min * 0.5);
            a.monthlyIncome.max = Math.floor(a.monthlyIncome.max * 0.5);
          });
          player.stress += 20;
          return 'You sold at the bottom. Classic mistake.';
        }
      },
      {
        text: 'Buy the dip!',
        effect: '-$5,000, buy discounted stocks',
        action: (player) => {
          player.money -= 5000;
          player.addAsset({
            id: 'dipBuy_' + Date.now(),
            name: 'Discounted Stocks',
            icon: '📈',
            cost: 5000,
            monthlyIncome: { min: 80, max: 350 },
            category: 'stocks',
            volatility: 0.25
          });
          player.finIQ += 10;
          return 'Bold move! You bought when others feared.';
        }
      },
      {
        text: 'Hold and wait',
        effect: 'No action, market may recover',
        action: (player) => {
          player.finIQ += 8;
          return 'Patience. Markets recover. You stayed calm.';
        }
      }
    ],
    minFinIQ: 15,
    probability: 0.08
  },
  {
    id: 'investment_tip',
    title: 'Hot Stock Tip',
    icon: '💡',
    description: 'A coworker says he has a "guaranteed" stock tip. The stock will "definitely" go up 200% this month.',
    choices: [
      {
        text: 'Go all in! $10,000',
        effect: 'High risk, high reward',
        action: (player) => {
          player.money -= 10000;
          if (Math.random() > 0.7) {
            player.money += 25000;
            return 'Lucky! The tip paid off. +$15,000 profit!';
          } else {
            return 'The tip was wrong. You lost $10,000. Never trust "guaranteed" tips.';
          }
        }
      },
      {
        text: 'Invest a small amount ($1,000)',
        effect: 'Limited risk',
        action: (player) => {
          player.money -= 1000;
          if (Math.random() > 0.6) {
            player.money += 3000;
            return 'Small win! +$2,000 profit.';
          } else {
            return 'Lost $1,000. But at least you limited your risk.';
          }
        }
      },
      {
        text: 'Ignore it',
        effect: 'No risk, no FOMO',
        action: (player) => {
          player.finIQ += 5;
          return 'Wise choice. There are no "guaranteed" tips in investing.';
        }
      }
    ],
    minFinIQ: 0,
    probability: 0.1
  },
  {
    id: 'real_estate_deal',
    title: 'Real Estate Opportunity',
    icon: '🏠',
    description: 'A property just came on the market below market value. The owner needs to sell fast.',
    choices: [
      {
        text: 'Buy it! ($50,000 down)',
        effect: '-$50,000, rental income',
        action: (player) => {
          if (player.money >= 50000) {
            player.money -= 50000;
            player.addAsset({
              id: 'quickDeal_' + Date.now(),
              name: 'Bargain Property',
              icon: '🏠',
              cost: 50000,
              monthlyIncome: { min: 500, max: 1200 },
              category: 'realestate',
              volatility: 0.1
            });
            return 'Great deal! You now own rental property.';
          } else {
            return 'You don\'t have enough cash. Opportunity missed.';
          }
        }
      },
      {
        text: 'Pass - too risky',
        effect: 'No action',
        action: (player) => {
          player.finIQ += 3;
          return 'Better to miss a deal than make a bad one.';
        }
      }
    ],
    minFinIQ: 35,
    probability: 0.08
  },
  {
    id: 'emergency',
    title: 'Medical Emergency',
    icon: '🏥',
    description: 'You need unexpected surgery. The bill is $8,000. How do you handle it?',
    choices: [
      {
        text: 'Pay with savings',
        effect: '-$8,000 cash',
        action: (player) => {
          player.money -= 8000;
          return 'Expensive, but no debt added.';
        }
      },
      {
        text: 'Put it on credit',
        effect: '+$8,000 credit card debt',
        action: (player) => {
          player.addLiability({
            id: 'medicalDebt_' + Date.now(),
            name: 'Medical Debt',
            icon: '🏥',
            balance: 8000,
            monthlyPayment: 350,
            interestRate: 0.15
          });
          return 'You financed it. Now you have more debt.';
        }
      },
      {
        text: 'Negotiate payment plan',
        effect: '-$2,000/mo for 4 months',
        action: (player) => {
          player.money -= 2000;
          player.baseExpenses += 2000;
          setTimeout(() => { player.baseExpenses -= 2000; }, 4);
          return 'You negotiated! Smaller payments over time.';
        }
      }
    ],
    minFinIQ: 0,
    probability: 0.1
  },
  {
    id: 'crypto_boom',
    title: 'Crypto is Mooning!',
    icon: '🚀',
    description: 'Bitcoin just doubled in a week! Your friend made $50,000. FOMO is real.',
    choices: [
      {
        text: 'FOMO in! $5,000',
        effect: 'High risk crypto play',
        action: (player) => {
          player.money -= 5000;
          const result = Math.random();
          if (result > 0.6) {
            player.money += 12000;
            return 'To the moon! +$7,000 profit!';
          } else if (result > 0.3) {
            player.money += 3000;
            return 'Small gain. At least you didn\'t lose.';
          } else {
            return 'Crash! You lost most of it. Crypto is volatile.';
          }
        }
      },
      {
        text: 'Stick to your plan',
        effect: 'No FOMO',
        action: (player) => {
          player.finIQ += 8;
          return 'Discipline beats FOMO every time.';
        }
      }
    ],
    minFinIQ: 20,
    probability: 0.1
  },
  {
    id: 'education_offer',
    title: 'MBA Opportunity',
    icon: '🎓',
    description: 'You got accepted to an MBA program. It costs $30,000 but could boost your career.',
    choices: [
      {
        text: 'Enroll! Take the loan',
        effect: '+$30,000 student loan, +20 FinIQ',
        action: (player) => {
          player.addLiability({
            id: 'mbaLoan_' + Date.now(),
            name: 'MBA Loan',
            icon: '🎓',
            balance: 30000,
            monthlyPayment: 500,
            interestRate: 0.05
          });
          player.finIQ += 20;
          return 'Education is the best investment. You\'re smarter now!';
        }
      },
      {
        text: 'Self-educate instead',
        effect: '+10 FinIQ, no debt',
        action: (player) => {
          player.finIQ += 10;
          player.money -= 500;
          return 'You learned on your own. Not as flashy, but no debt.';
        }
      },
      {
        text: 'Skip it',
        effect: 'No change',
        action: (player) => {
          return 'You passed. Focus on what you have.';
        }
      }
    ],
    minFinIQ: 25,
    probability: 0.08
  },
  {
    id: 'passive_income_course',
    title: 'Online Course Creator',
    icon: '💻',
    description: 'You have expertise in something. Want to create an online course?',
    choices: [
      {
        text: 'Create the course! ($1,000 + time)',
        effect: '-$1,000, potential passive income',
        action: (player) => {
          player.money -= 1000;
          player.addAsset({
            id: 'onlineCourse_' + Date.now(),
            name: 'Online Course',
            icon: '💻',
            cost: 1000,
            monthlyIncome: { min: 100, max: 800 },
            category: 'digital',
            volatility: 0.2
          });
          return 'You created a course! Now it sells while you sleep.';
        }
      },
      {
        text: 'Not now',
        effect: 'No action',
        action: (player) => {
          return 'Maybe later. Timing matters.';
        }
      }
    ],
    minFinIQ: 15,
    probability: 0.1
  }
];

// Random events (not choices, just happen)
export const RANDOM_EVENTS = {
  positive: [
    {
      id: 'tax_refund',
      name: 'Tax Refund!',
      icon: '💵',
      description: 'The government sent you a refund!',
      action: (player) => {
        const amount = 500 + Math.floor(Math.random() * 1500);
        player.money += amount;
        return `You received $${amount.toLocaleString()} in tax refund!`;
      }
    },
    {
      id: 'bonus',
      name: 'Work Bonus',
      icon: '🎁',
      description: 'Your company gave you a performance bonus!',
      action: (player) => {
        const amount = 1000 + Math.floor(Math.random() * 2000);
        player.money += amount;
        return `You got a $${amount.toLocaleString()} bonus!`;
      }
    },
    {
      id: 'side_boom',
      name: 'Side Hustle Boom',
      icon: '📈',
      description: 'Your side hustle had an amazing month!',
      action: (player) => {
        player.temporaryBonus = { type: 'sideIncome', multiplier: 2, months: 1 };
        return 'Side hustle income doubled this month!';
      }
    },
    {
      id: 'mentor_found',
      name: 'Mentor Found!',
      icon: '🧠',
      description: 'You met a successful entrepreneur who shared wisdom.',
      action: (player) => {
        player.finIQ += 10;
        return '+10 Financial IQ from mentorship!';
      }
    },
    {
      id: 'free_course',
      name: 'Free Course',
      icon: '📚',
      description: 'Found an amazing free financial course online!',
      action: (player) => {
        player.finIQ += 8;
        return '+8 Financial IQ from free learning!';
      }
    }
  ],
  negative: [
    {
      id: 'car_breakdown',
      name: 'Car Trouble',
      icon: '🔧',
      description: 'Your car broke down. Emergency repairs needed.',
      action: (player) => {
        const cost = 500 + Math.floor(Math.random() * 1500);
        player.money -= cost;
        player.stress += 15;
        return `Repairs cost $${cost.toLocaleString()}. Ouch!`;
      }
    },
    {
      id: 'rent_increase',
      name: 'Rent Increase',
      icon: '📈',
      description: 'Your landlord raised the rent!',
      action: (player) => {
        player.baseExpenses += 200;
        return 'Rent went up $200/month!';
      }
    },
    {
      id: 'inflation',
      name: 'Inflation Spike',
      icon: '💰',
      description: 'Everything costs more now!',
      action: (player) => {
        player.baseExpenses = Math.floor(player.baseExpenses * 1.1);
        return 'Expenses increased by 10% due to inflation!';
      }
    },
    {
      id: 'market_dip',
      name: 'Market Dip',
      icon: '📉',
      description: 'Your investments took a small hit.',
      action: (player) => {
        const stockAssets = player.assets.filter(a => a.category === 'stocks');
        stockAssets.forEach(a => {
          a.monthlyIncome.min = Math.floor(a.monthlyIncome.min * 0.8);
          a.monthlyIncome.max = Math.floor(a.monthlyIncome.max * 0.8);
        });
        return 'Stock returns down 20% this month.';
      }
    },
    {
      id: 'stress_event',
      name: 'Burnout Warning',
      icon: '😫',
      description: 'You\'re working too hard. Need to rest.',
      action: (player) => {
        player.stress += 25;
        return 'Stress increased! Consider resting.';
      }
    }
  ],
  boss: [
    {
      id: 'recession',
      name: 'ECONOMIC RECESSION',
      icon: '⚠️',
      description: 'The economy crashed! All investments suffer.',
      action: (player) => {
        player.assets.forEach(a => {
          a.monthlyIncome.min = Math.floor(a.monthlyIncome.min * 0.5);
          a.monthlyIncome.max = Math.floor(a.monthlyIncome.max * 0.5);
        });
        player.stress += 30;
        return 'RECESSION! All asset income halved for 6 months!';
      },
      duration: 6
    },
    {
      id: 'job_loss',
      name: 'JOB LOSS',
      icon: '❌',
      description: 'Company downsized. You lost your job!',
      action: (player) => {
        player.job = null;
        player.stress += 40;
        return 'You lost your job! Find a new one ASAP!';
      },
      duration: 0
    }
  ]
};
