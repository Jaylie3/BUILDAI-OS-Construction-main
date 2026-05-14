const quoteForm = document.getElementById('quoteForm');
const resultTitle = document.getElementById('resultTitle');
const resultMeta = document.getElementById('resultMeta');
const resultTotal = document.getElementById('resultTotal');
const materials = document.getElementById('materials');
const labour = document.getElementById('labour');
const timeline = document.getElementById('timeline');
const proposal = document.getElementById('proposal');
const toast = document.getElementById('toast');
const copyQuote = document.getElementById('copyQuote');
const waLink = document.getElementById('waLink');
const dashTitle = document.getElementById('dashTitle');
const dashMeta = document.getElementById('dashMeta');
const dashTotal = document.getElementById('dashTotal');
const leadButtons = document.querySelectorAll('[data-lead]');

const rates = {
  'Boundary wall': [375, 3, 0.6],
  'Bathroom renovation': [2100, 8, 0.55],
  'Roof repair': [950, 4, 0.5],
  'Warehouse repair': [1600, 6, 0.58],
  'General building work': [1200, 5, 0.55],
};

const multipliers = {
  standard: 1,
  premium: 1.35,
  urgent: 1.22,
};

const formatCurrency = (value) => {
  return 'R' + Math.round(value).toLocaleString('en-ZA');
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll('.fade').forEach((element) => observer.observe(element));

function renderQuote() {
  const formData = Object.fromEntries(new FormData(quoteForm));
  const rate = rates[formData.jobType] || rates['General building work'];
  const size = Math.max(1, Number(formData.size) || 1);
  const multiplier = multipliers[formData.finish] || multipliers.standard;
  const total = rate[0] * size * multiplier;
  const materialsValue = total * rate[2];
  const labourValue = total - materialsValue;
  const days = Math.max(1, Math.round(rate[1] * multiplier));
  const customerName = formData.customer?.trim() || 'there';
  const location = formData.location?.trim() || 'your site';
  const notes = formData.notes?.trim() || 'No extra notes added.';

  const quoteMessage = `Hi ${customerName}, your ${formData.jobType} estimate for ${location} is ${formatCurrency(
    total
  )}. This includes materials (${formatCurrency(materialsValue)}), labour (${formatCurrency(labourValue)}), transport, and a ${days}-day timeline. Payment terms are 50% deposit and 50% on completion. Notes: ${notes} Shall I send the deposit invoice?`;

  resultTitle.textContent = `${size}m ${formData.jobType}`;
  resultMeta.textContent = `${location} - ${days}-day build - 50% deposit`;
  resultTotal.textContent = formatCurrency(total);
  materials.textContent = formatCurrency(materialsValue);
  labour.textContent = formatCurrency(labourValue);
  timeline.textContent = `${days} days`;
  proposal.textContent = quoteMessage;
  waLink.href = `https://wa.me/+27780122274?text=${encodeURIComponent(quoteMessage)}`;
}

quoteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  renderQuote();
  toast.textContent = 'Quote generated and WhatsApp message prepared.';
});

copyQuote.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(proposal.textContent);
    toast.textContent = 'Quote copied.';
  } catch (error) {
    toast.textContent = 'Copy failed. Please select the quote text and copy manually.';
  }
});

const leads = [
  [
    '20m boundary wall',
    'Durban, 3-day build, deposit required',
    'R7,500',
    ['Materials and transport', 'R4,500'],
    ['Labour and site prep', 'R3,000'],
    ['Payment terms', '50/50'],
  ],
  [
    'Bathroom renovation',
    'Umhlanga, 8-day build, premium finish',
    'R42,000',
    ['Materials and fittings', 'R23,100'],
    ['Labour and site prep', 'R18,900'],
    ['Payment terms', '60/40'],
  ],
  [
    'Warehouse repairs',
    'Pinetown, 6-day build, safety priority',
    'R96,000',
    ['Materials and access hire', 'R55,680'],
    ['Labour and site prep', 'R40,320'],
    ['Payment terms', '50/50'],
  ],
];

leadButtons.forEach((button) => {
  button.addEventListener('click', () => {
    leadButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');

    const leadIndex = Number(button.dataset.lead);
    const selectedLead = leads[leadIndex];

    dashTitle.textContent = selectedLead[0];
    dashMeta.textContent = selectedLead[1];
    dashTotal.textContent = selectedLead[2];

    const lineLabels = [
      document.getElementById('l1'),
      document.getElementById('l2'),
      document.getElementById('l3'),
    ];
    const lineValues = [
      document.getElementById('v1'),
      document.getElementById('v2'),
      document.getElementById('v3'),
    ];

    lineLabels.forEach((label, index) => {
      label.textContent = selectedLead[index + 3][0];
      lineValues[index].textContent = selectedLead[index + 3][1];
    });
  });
});

renderQuote();
