// Recycling locations dataset
// Clearly labeled as demonstration data per academic guidelines
const RECYCLING_CENTRES = [
  {
    id: 'rc_1',
    name: 'EcoHub Community Recycling Depot',
    area: 'Downtown',
    address: '142 Evergreen Boulevard, Downtown Metro',
    coordinates: [40.7128, -74.0060],
    acceptedMaterials: ['Electronics & E-waste', 'Plastics #1-#5', 'Paper & Cardboard', 'Glass Bottles'],
    hours: 'Mon-Sat: 08:00 AM - 06:00 PM',
    phone: '+1 (555) 234-5678',
    externalMapUrl: 'https://www.openstreetmap.org/?mlat=40.7128&mlon=-74.0060#map=16/40.7128/-74.0060',
    type: 'Drop-off Depot',
    isDemonstration: true,
    verificationStatus: 'Academic Demonstration Sample',
  },
  {
    id: 'rc_2',
    name: 'GreenValley E-Waste & Battery Station',
    area: 'Green Valley',
    address: '88 Meadowbrook Road, Green Valley District',
    coordinates: [40.7306, -73.9352],
    acceptedMaterials: ['Computers & Phones', 'Rechargeable Batteries', 'Small Appliances', 'Printer Cartridges'],
    hours: 'Tue-Sun: 09:00 AM - 05:00 PM',
    phone: '+1 (555) 345-6789',
    externalMapUrl: 'https://www.openstreetmap.org/?mlat=40.7306&mlon=-73.9352#map=16/40.7306/-73.9352',
    type: 'Specialized E-Waste Drop-off',
    isDemonstration: true,
    verificationStatus: 'Academic Demonstration Sample',
  },
  {
    id: 'rc_3',
    name: 'Maplewood Textile & Fiber Reclaim Center',
    area: 'Maplewood',
    address: '320 Timberline Way, Maplewood North',
    coordinates: [40.7580, -73.9855],
    acceptedMaterials: ['Used Clothing', 'Shoes & Belts', 'Linens & Bedding', 'Scrap Fabrics'],
    hours: 'Mon-Fri: 09:00 AM - 07:00 PM, Sat: 10:00 AM - 04:00 PM',
    phone: '+1 (555) 456-7890',
    externalMapUrl: 'https://www.openstreetmap.org/?mlat=40.7580&mlon=-73.9855#map=16/40.7580/-73.9855',
    type: 'Textile Collection Station',
    isDemonstration: true,
    verificationStatus: 'Academic Demonstration Sample',
  },
  {
    id: 'rc_4',
    name: 'Riverside Compost & Organic Yard Waste Hub',
    area: 'Riverside',
    address: '15 Riverpark Lane, Riverside Commons',
    coordinates: [40.7829, -73.9654],
    acceptedMaterials: ['Clean Yard Trimmings', 'Food Scraps', 'Untreated Wood Scrap'],
    hours: 'Wednesday & Saturday: 08:00 AM - 03:00 PM',
    phone: '+1 (555) 567-8901',
    externalMapUrl: 'https://www.openstreetmap.org/?mlat=40.7829&mlon=-73.9654#map=16/40.7829/-73.9654',
    type: 'Organics & Composting Site',
    isDemonstration: true,
    verificationStatus: 'Academic Demonstration Sample',
  },
  {
    id: 'rc_5',
    name: 'Eastside Scrap Metal & Hardware Exchange',
    area: 'Eastside',
    address: '50 Industrial Parkway, Eastside Industrial',
    coordinates: [40.6782, -73.9442],
    acceptedMaterials: ['Aluminum Cans', 'Scrap Steel & Copper', 'Brass Fixtures', 'Wire Cables'],
    hours: 'Mon-Fri: 07:30 AM - 04:30 PM',
    phone: '+1 (555) 678-9012',
    externalMapUrl: 'https://www.openstreetmap.org/?mlat=40.6782&mlon=-73.9442#map=16/40.6782/-73.9442',
    type: 'Metal Recycling Facility',
    isDemonstration: true,
    verificationStatus: 'Academic Demonstration Sample',
  },
];

const getRecyclingCentres = async (req, res) => {
  try {
    const { area, material } = req.query;
    let results = [...RECYCLING_CENTRES];

    if (area) {
      const q = area.toLowerCase();
      results = results.filter(
        c => c.area.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.address.toLowerCase().includes(q)
      );
    }

    if (material) {
      const m = material.toLowerCase();
      results = results.filter(c => c.acceptedMaterials.some(mat => mat.toLowerCase().includes(m)));
    }

    return res.json({
      success: true,
      count: results.length,
      demonstrationNotice: 'Notice: As per academic project criteria, these recycling locations are structured demonstration sample data to illustrate interactive map and routing capabilities.',
      data: results,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getRecyclingCentres };
