export async function generateResponse(prompt: string): Promise<string> {
  const text = prompt.toLowerCase();

  const tips: string[] = [];

  if (/eye|vision|red|itch|dry/.test(text)) {
    tips.push(
      'For dry or irritated eyes: use preservative-free artificial tears 3–4x/day, take screen breaks (20-20-20), and avoid rubbing your eyes.'
    );
  }
  if (/skin|rash|acne|itch/.test(text)) {
    tips.push(
      'For mild skin irritation: cleanse gently, moisturize twice daily, avoid harsh products, and consider 1% hydrocortisone for up to 7 days.'
    );
  }
  if (/tooth|teeth|gum|mouth/.test(text)) {
    tips.push(
      'For dental discomfort: brush and floss gently, use a fluoride rinse, avoid very hot/cold foods, and consider acetaminophen as directed.'
    );
  }
  if (/ear|hearing|wax|tinnitus/.test(text)) {
    tips.push(
      'For ear fullness: avoid inserting objects, try warm compresses, and consider over-the-counter carbamide peroxide drops if wax is suspected.'
    );
  }

  if (tips.length === 0) {
    tips.push(
      'General wellness: stay hydrated, sleep 7–9 hours, manage stress, and seek professional care if symptoms persist or worsen.'
    );
  }

  return [
    'Here are some quick, general suggestions (not medical advice):',
    '',
    ...tips.map((t) => `- ${t}`),
  ].join('\n');
}


