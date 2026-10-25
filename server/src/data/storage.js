const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { getIsConnected } = require('../config/db');

// Mongoose Models
const User = require('../models/User');
const Item = require('../models/Item');
const ItemRequest = require('../models/ItemRequest');
const CommunityRequest = require('../models/CommunityRequest');
const Report = require('../models/Report');

const DATA_FILE = path.join(__dirname, 'db.json');

// Category waste reduction estimates in kilograms
const CATEGORY_WEIGHT_MAP = {
  Furniture: 18.5,
  Electronics: 6.2,
  Books: 1.8,
  Clothes: 2.1,
  'School Supplies': 1.2,
  Other: 3.0,
};

// Seed sample dataset for initial startup (labeled as sample demonstration data)
const getInitialSeed = () => {
  const salt = bcrypt.genSaltSync(10);
  const adminHash = bcrypt.hashSync('admin123', salt);
  const user1Hash = bcrypt.hashSync('ecopass123', salt);
  const user2Hash = bcrypt.hashSync('ecopass123', salt);

  const adminId = '654321000000000000000001';
  const user1Id = '654321000000000000000002';
  const user2Id = '654321000000000000000003';

  const users = [
    {
      _id: adminId,
      name: 'EcoConnect Admin',
      email: 'admin@ecoconnect.org',
      password: adminHash,
      role: 'admin',
      location: 'Green Valley District',
      bio: 'Platform coordinator overseeing community sustainability and verification.',
      createdAt: new Date('2026-09-01T10:00:00Z').toISOString(),
    },
    {
      _id: user1Id,
      name: 'Sarah Jenkins',
      email: 'sarah@ecoconnect.org',
      password: user1Hash,
      role: 'user',
      location: 'Maplewood North',
      bio: 'Urban gardener, zero-waste enthusiast, giving preloved furniture and books new life.',
      createdAt: new Date('2026-09-10T11:30:00Z').toISOString(),
    },
    {
      _id: user2Id,
      name: 'David Chen',
      email: 'david@ecoconnect.org',
      password: user2Hash,
      role: 'user',
      location: 'Riverside Commons',
      bio: 'College student sharing extra textbooks and electronics to minimize e-waste.',
      createdAt: new Date('2026-09-15T14:20:00Z').toISOString(),
    },
  ];

  const items = [
    {
      _id: '654321000000000000000101',
      title: 'Solid Pine Study Desk & Chair',
      category: 'Furniture',
      description: 'Sturdy natural pine desk with 2 smooth-gliding drawers and a matching ergonomic chair. Ideal for a student study setup.',
      condition: 'Gently Used',
      imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
      location: 'Maplewood North (Near Central Park)',
      contactPreference: 'In-app Requests Only',
      status: 'Available',
      donor: user1Id,
      donorName: 'Sarah Jenkins',
      donorEmail: 'sarah@ecoconnect.org',
      recipient: null,
      recipientName: null,
      estimatedWasteDivertedKg: 22.0,
      completedAt: null,
      createdAt: new Date('2026-10-18T09:15:00Z').toISOString(),
    },
    {
      _id: '654321000000000000000102',
      title: 'Calculus & College Physics Textbooks (Vol 1-2)',
      category: 'Books',
      description: 'Comprehensive college textbooks in excellent condition. No highlights or torn pages. Perfect for freshman engineering students.',
      condition: 'Like New',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      location: 'Riverside Commons Campus Area',
      contactPreference: 'In-app Requests Only',
      status: 'Available',
      donor: user2Id,
      donorName: 'David Chen',
      donorEmail: 'david@ecoconnect.org',
      recipient: null,
      recipientName: null,
      estimatedWasteDivertedKg: 3.5,
      completedAt: null,
      createdAt: new Date('2026-10-19T14:30:00Z').toISOString(),
    },
    {
      _id: '654321000000000000000103',
      title: 'Dell 24" UltraSharp IPS Monitor with HDMI',
      category: 'Electronics',
      description: 'Tested and fully working 1080p IPS display with adjustable height stand and power cable. Replaced due to laptop upgrade.',
      condition: 'Gently Used',
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
      location: 'Downtown Tech Hub',
      contactPreference: 'In-app Requests Only',
      status: 'Available',
      donor: user1Id,
      donorName: 'Sarah Jenkins',
      donorEmail: 'sarah@ecoconnect.org',
      recipient: null,
      recipientName: null,
      estimatedWasteDivertedKg: 5.8,
      completedAt: null,
      createdAt: new Date('2026-10-20T11:00:00Z').toISOString(),
    },
    {
      _id: '654321000000000000000104',
      title: 'Warm Winter Coats & Woolen Sweaters (Size M/L)',
      category: 'Clothes',
      description: 'Clean, fresh winter apparel bundle including an insulated navy parka and two comfortable woolen knit pullovers.',
      condition: 'Like New',
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
      location: 'Green Valley District',
      contactPreference: 'In-app Requests Only',
      status: 'Completed',
      donor: user1Id,
      donorName: 'Sarah Jenkins',
      donorEmail: 'sarah@ecoconnect.org',
      recipient: user2Id,
      recipientName: 'David Chen',
      estimatedWasteDivertedKg: 3.2,
      completedAt: new Date('2026-10-21T16:00:00Z').toISOString(),
      createdAt: new Date('2026-10-15T10:00:00Z').toISOString(),
    },
    {
      _id: '654321000000000000000105',
      title: 'Complete Art & Architecture Sketching Kit',
      category: 'School Supplies',
      description: 'Includes professional drafting pencils, T-square, acrylic rulers, drawing clips, and archival paper pads.',
      condition: 'Like New',
      imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
      location: 'Eastside Arts Quarter',
      contactPreference: 'In-app Requests Only',
      status: 'Available',
      donor: user2Id,
      donorName: 'David Chen',
      donorEmail: 'david@ecoconnect.org',
      recipient: null,
      recipientName: null,
      estimatedWasteDivertedKg: 1.5,
      completedAt: null,
      createdAt: new Date('2026-10-22T08:45:00Z').toISOString(),
    },
  ];

  const itemRequests = [
    {
      _id: '654321000000000000000201',
      item: '654321000000000000000104',
      itemTitle: 'Warm Winter Coats & Woolen Sweaters (Size M/L)',
      requester: user2Id,
      requesterName: 'David Chen',
      requesterEmail: 'david@ecoconnect.org',
      donor: user1Id,
      message: 'Hello Sarah! I am volunteering with local shelter drives and would love to collect these warm coats.',
      status: 'Completed',
      createdAt: new Date('2026-10-16T12:00:00Z').toISOString(),
    },
  ];

  const communityRequests = [
    {
      _id: '654321000000000000000301',
      title: 'Need a Working Microwave for Community Kitchen',
      category: 'Electronics',
      description: 'Our non-profit youth community center is looking for a clean, working microwave oven to prepare after-school warm snacks.',
      location: 'Westend Community Hall',
      imageUrl: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80',
      urgency: 'High',
      requester: user2Id,
      requesterName: 'David Chen',
      requesterEmail: 'david@ecoconnect.org',
      status: 'Open',
      offers: [
        {
          donorId: user1Id,
          donorName: 'Sarah Jenkins',
          donorEmail: 'sarah@ecoconnect.org',
          message: 'Hi David! We upgraded our office lunchroom and have an 800W Panasonic microwave ready for pickup!',
          offeredAt: new Date('2026-10-21T18:00:00Z').toISOString(),
        },
      ],
      createdAt: new Date('2026-10-19T09:00:00Z').toISOString(),
    },
    {
      _id: '654321000000000000000302',
      title: 'Looking for Children\'s Story Books & Novels',
      category: 'Books',
      description: 'Creating a mini street library box for neighborhood kids. Any illustrated picture books or middle-grade novels are welcome.',
      location: 'Green Valley District',
      imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
      urgency: 'Medium',
      requester: user1Id,
      requesterName: 'Sarah Jenkins',
      requesterEmail: 'sarah@ecoconnect.org',
      status: 'Open',
      offers: [],
      createdAt: new Date('2026-10-21T14:15:00Z').toISOString(),
    },
  ];

  const reports = [
    {
      _id: '654321000000000000000401',
      targetType: 'Item',
      targetId: '654321000000000000000101',
      targetTitle: 'Solid Pine Study Desk & Chair',
      reporter: user2Id,
      reporterName: 'David Chen',
      reason: 'Question regarding pickup access during weekend hours.',
      status: 'Reviewed',
      resolutionNotes: 'Clarified with donor; listing details updated with parking instructions.',
      createdAt: new Date('2026-10-20T10:00:00Z').toISOString(),
    },
  ];

  return { users, items, itemRequests, communityRequests, reports };
};

// In-Memory & Local JSON Store for Development Fallback
class LocalStore {
  constructor() {
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        this.data = JSON.parse(raw);
      } else {
        this.data = getInitialSeed();
        this.save();
      }
    } catch (err) {
      console.warn('[EcoConnect LocalStore] Initializing fresh seed due to read error:', err.message);
      this.data = getInitialSeed();
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('[EcoConnect LocalStore] Failed to write db.json:', err.message);
    }
  }

  // --- Users ---
  async findUserByEmail(email) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async findUserById(id) {
    return this.data.users.find(u => u._id.toString() === id.toString()) || null;
  }

  async createUser(userData) {
    const _id = 'user_' + Date.now() + Math.random().toString(36).substring(2, 7);
    const user = {
      _id,
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: userData.password,
      role: userData.role || 'user',
      location: userData.location || 'Local Community',
      bio: userData.bio || 'EcoConnect member promoting sustainable community reuse.',
      phone: userData.phone || '',
      createdAt: new Date().toISOString(),
    };
    this.data.users.push(user);
    this.save();
    return user;
  }

  async updateUser(id, updateData) {
    const idx = this.data.users.findIndex(u => u._id.toString() === id.toString());
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updateData };
    this.save();
    return this.data.users[idx];
  }

  async getAllUsers() {
    return this.data.users.map(({ password, ...u }) => u);
  }

  // --- Items ---
  async getItems(filter = {}) {
    let items = [...this.data.items];
    if (filter.category && filter.category !== 'All') {
      items = items.filter(i => i.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.condition && filter.condition !== 'All') {
      items = items.filter(i => i.condition.toLowerCase() === filter.condition.toLowerCase());
    }
    if (filter.status && filter.status !== 'All') {
      items = items.filter(i => i.status.toLowerCase() === filter.status.toLowerCase());
    }
    if (filter.donor) {
      items = items.filter(i => i.donor.toString() === filter.donor.toString());
    }
    if (filter.recipient) {
      items = items.filter(i => i.recipient && i.recipient.toString() === filter.recipient.toString());
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      items = items.filter(i => 
        i.title.toLowerCase().includes(q) || 
        i.description.toLowerCase().includes(q) || 
        i.location.toLowerCase().includes(q)
      );
    }
    return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getItemById(id) {
    return this.data.items.find(i => i._id.toString() === id.toString()) || null;
  }

  async createItem(itemData) {
    const _id = 'item_' + Date.now() + Math.random().toString(36).substring(2, 7);
    const weight = CATEGORY_WEIGHT_MAP[itemData.category] || 2.5;
    const item = {
      _id,
      title: itemData.title,
      category: itemData.category,
      description: itemData.description,
      condition: itemData.condition,
      imageUrl: itemData.imageUrl || '',
      location: itemData.location,
      contactPreference: itemData.contactPreference || 'In-app Requests Only',
      status: 'Available',
      donor: itemData.donor.toString(),
      donorName: itemData.donorName,
      donorEmail: itemData.donorEmail || '',
      recipient: null,
      recipientName: null,
      estimatedWasteDivertedKg: weight,
      completedAt: null,
      createdAt: new Date().toISOString(),
    };
    this.data.items.unshift(item);
    this.save();
    return item;
  }

  async updateItem(id, updateData) {
    const idx = this.data.items.findIndex(i => i._id.toString() === id.toString());
    if (idx === -1) return null;
    this.data.items[idx] = { ...this.data.items[idx], ...updateData };
    this.save();
    return this.data.items[idx];
  }

  async deleteItem(id) {
    const idx = this.data.items.findIndex(i => i._id.toString() === id.toString());
    if (idx === -1) return false;
    this.data.items.splice(idx, 1);
    // Also remove requests associated with this item
    this.data.itemRequests = this.data.itemRequests.filter(r => r.item.toString() !== id.toString());
    this.save();
    return true;
  }

  // --- Item Requests ---
  async getItemRequests(filter = {}) {
    let requests = [...this.data.itemRequests];
    if (filter.donor) {
      requests = requests.filter(r => r.donor.toString() === filter.donor.toString());
    }
    if (filter.requester) {
      requests = requests.filter(r => r.requester.toString() === filter.requester.toString());
    }
    if (filter.item) {
      requests = requests.filter(r => r.item.toString() === filter.item.toString());
    }
    return requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getItemRequestById(id) {
    return this.data.itemRequests.find(r => r._id.toString() === id.toString()) || null;
  }

  async createItemRequest(reqData) {
    const _id = 'req_' + Date.now() + Math.random().toString(36).substring(2, 7);
    const request = {
      _id,
      item: reqData.item.toString(),
      itemTitle: reqData.itemTitle,
      requester: reqData.requester.toString(),
      requesterName: reqData.requesterName,
      requesterEmail: reqData.requesterEmail,
      donor: reqData.donor.toString(),
      message: reqData.message,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    this.data.itemRequests.unshift(request);
    this.save();
    return request;
  }

  async updateItemRequest(id, updateData) {
    const idx = this.data.itemRequests.findIndex(r => r._id.toString() === id.toString());
    if (idx === -1) return null;
    this.data.itemRequests[idx] = { ...this.data.itemRequests[idx], ...updateData };
    this.save();
    return this.data.itemRequests[idx];
  }

  // --- Community Requests ---
  async getCommunityRequests(filter = {}) {
    let list = [...this.data.communityRequests];
    if (filter.category && filter.category !== 'All') {
      list = list.filter(r => r.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.status && filter.status !== 'All') {
      list = list.filter(r => r.status.toLowerCase() === filter.status.toLowerCase());
    }
    if (filter.requester) {
      list = list.filter(r => r.requester.toString() === filter.requester.toString());
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(r => 
        r.title.toLowerCase().includes(q) || 
        r.description.toLowerCase().includes(q) || 
        r.location.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getCommunityRequestById(id) {
    return this.data.communityRequests.find(r => r._id.toString() === id.toString()) || null;
  }

  async createCommunityRequest(reqData) {
    const _id = 'comm_' + Date.now() + Math.random().toString(36).substring(2, 7);
    const commReq = {
      _id,
      title: reqData.title,
      category: reqData.category,
      description: reqData.description,
      location: reqData.location,
      imageUrl: reqData.imageUrl || '',
      urgency: reqData.urgency || 'Medium',
      requester: reqData.requester.toString(),
      requesterName: reqData.requesterName,
      requesterEmail: reqData.requesterEmail || '',
      status: 'Open',
      offers: [],
      createdAt: new Date().toISOString(),
    };
    this.data.communityRequests.unshift(commReq);
    this.save();
    return commReq;
  }

  async updateCommunityRequest(id, updateData) {
    const idx = this.data.communityRequests.findIndex(r => r._id.toString() === id.toString());
    if (idx === -1) return null;
    this.data.communityRequests[idx] = { ...this.data.communityRequests[idx], ...updateData };
    this.save();
    return this.data.communityRequests[idx];
  }

  async addOfferToCommunityRequest(id, offerData) {
    const req = await this.getCommunityRequestById(id);
    if (!req) return null;
    if (!req.offers) req.offers = [];
    req.offers.push({
      donorId: offerData.donorId.toString(),
      donorName: offerData.donorName,
      donorEmail: offerData.donorEmail || '',
      message: offerData.message,
      offeredAt: new Date().toISOString(),
    });
    this.save();
    return req;
  }

  async deleteCommunityRequest(id) {
    const idx = this.data.communityRequests.findIndex(r => r._id.toString() === id.toString());
    if (idx === -1) return false;
    this.data.communityRequests.splice(idx, 1);
    this.save();
    return true;
  }

  // --- Reports ---
  async getReports(filter = {}) {
    let reports = [...this.data.reports];
    if (filter.status && filter.status !== 'All') {
      reports = reports.filter(r => r.status.toLowerCase() === filter.status.toLowerCase());
    }
    return reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async createReport(reportData) {
    const _id = 'rep_' + Date.now() + Math.random().toString(36).substring(2, 7);
    const report = {
      _id,
      targetType: reportData.targetType || 'Item',
      targetId: reportData.targetId,
      targetTitle: reportData.targetTitle,
      reporter: reportData.reporter.toString(),
      reporterName: reportData.reporterName,
      reason: reportData.reason,
      status: 'Pending',
      resolutionNotes: '',
      createdAt: new Date().toISOString(),
    };
    this.data.reports.unshift(report);
    this.save();
    return report;
  }

  async updateReport(id, updateData) {
    const idx = this.data.reports.findIndex(r => r._id.toString() === id.toString());
    if (idx === -1) return null;
    this.data.reports[idx] = { ...this.data.reports[idx], ...updateData };
    this.save();
    return this.data.reports[idx];
  }

  // --- Environmental Impact Aggregations ---
  async getImpactStats(userId = null) {
    const totalListings = this.data.items.length;
    const completedExchanges = this.data.items.filter(i => i.status === 'Completed').length;
    const fulfilledCommunityRequests = this.data.communityRequests.filter(r => r.status === 'Fulfilled').length;
    
    // Sum waste diverted
    const totalWasteDivertedKg = this.data.items
      .filter(i => i.status === 'Completed')
      .reduce((acc, curr) => acc + (Number(curr.estimatedWasteDivertedKg) || 0), 0);

    // Tree equivalent: ~21.77 kg CO2 absorbed per mature tree/year. Waste diversion saves ~1.8 kg CO2/kg material diverted
    const co2SavedKg = Math.round(totalWasteDivertedKg * 1.85);
    const treeSeedlingsEquivalent = Math.round((co2SavedKg / 21.77) * 10) / 10;

    let userStats = null;
    if (userId) {
      const uId = userId.toString();
      const userDonations = this.data.items.filter(i => i.donor.toString() === uId);
      const userCompletedDonations = userDonations.filter(i => i.status === 'Completed');
      const userReceivedItems = this.data.items.filter(i => i.recipient && i.recipient.toString() === uId);
      const userCommunityReqs = this.data.communityRequests.filter(r => r.requester.toString() === uId);

      const userWasteDivertedKg = userCompletedDonations.reduce(
        (acc, curr) => acc + (Number(curr.estimatedWasteDivertedKg) || 0), 0
      );

      userStats = {
        totalDonated: userDonations.length,
        completedDonations: userCompletedDonations.length,
        itemsReceived: userReceivedItems.length,
        communityRequestsPosted: userCommunityReqs.length,
        personalWasteDivertedKg: Math.round(userWasteDivertedKg * 10) / 10,
        personalCo2SavedKg: Math.round(userWasteDivertedKg * 1.85 * 10) / 10,
      };
    }

    return {
      totalListings,
      activeAvailableItems: this.data.items.filter(i => i.status === 'Available').length,
      completedExchanges,
      totalFulfilledCommunityRequests: fulfilledCommunityRequests,
      totalWasteDivertedKg: Math.round(totalWasteDivertedKg * 10) / 10,
      estimatedCo2SavedKg: co2SavedKg,
      treeSeedlingsEquivalent,
      categoryBreakdown: this.getCategoryBreakdown(),
      userStats,
    };
  }

  getCategoryBreakdown() {
    const counts = {};
    const categories = ['Books', 'Clothes', 'Electronics', 'Furniture', 'School Supplies', 'Other'];
    categories.forEach(c => (counts[c] = 0));
    this.data.items.forEach(i => {
      if (counts[i.category] !== undefined) {
        counts[i.category]++;
      } else {
        counts.Other = (counts.Other || 0) + 1;
      }
    });
    return counts;
  }
}

// MongoStore adapter: calls Mongoose when MongoDB is connected
class MongoStore {
  async findUserByEmail(email) {
    return await User.findOne({ email: email.toLowerCase() });
  }

  async findUserById(id) {
    return await User.findById(id);
  }

  async createUser(userData) {
    return await User.create({
      ...userData,
      email: userData.email.toLowerCase(),
    });
  }

  async updateUser(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async getAllUsers() {
    return await User.find().select('-password').sort({ createdAt: -1 });
  }

  async getItems(filter = {}) {
    const q = {};
    if (filter.category && filter.category !== 'All') q.category = filter.category;
    if (filter.condition && filter.condition !== 'All') q.condition = filter.condition;
    if (filter.status && filter.status !== 'All') q.status = filter.status;
    if (filter.donor) q.donor = filter.donor;
    if (filter.recipient) q.recipient = filter.recipient;
    if (filter.search) {
      q.$or = [
        { title: { $regex: filter.search, $options: 'i' } },
        { description: { $regex: filter.search, $options: 'i' } },
        { location: { $regex: filter.search, $options: 'i' } },
      ];
    }
    return await Item.find(q).sort({ createdAt: -1 });
  }

  async getItemById(id) {
    return await Item.findById(id);
  }

  async createItem(itemData) {
    const weight = CATEGORY_WEIGHT_MAP[itemData.category] || 2.5;
    return await Item.create({
      ...itemData,
      estimatedWasteDivertedKg: weight,
    });
  }

  async updateItem(id, updateData) {
    return await Item.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteItem(id) {
    await ItemRequest.deleteMany({ item: id });
    const res = await Item.findByIdAndDelete(id);
    return !!res;
  }

  async getItemRequests(filter = {}) {
    const q = {};
    if (filter.donor) q.donor = filter.donor;
    if (filter.requester) q.requester = filter.requester;
    if (filter.item) q.item = filter.item;
    return await ItemRequest.find(q).sort({ createdAt: -1 });
  }

  async getItemRequestById(id) {
    return await ItemRequest.findById(id);
  }

  async createItemRequest(reqData) {
    return await ItemRequest.create(reqData);
  }

  async updateItemRequest(id, updateData) {
    return await ItemRequest.findByIdAndUpdate(id, updateData, { new: true });
  }

  async getCommunityRequests(filter = {}) {
    const q = {};
    if (filter.category && filter.category !== 'All') q.category = filter.category;
    if (filter.status && filter.status !== 'All') q.status = filter.status;
    if (filter.requester) q.requester = filter.requester;
    if (filter.search) {
      q.$or = [
        { title: { $regex: filter.search, $options: 'i' } },
        { description: { $regex: filter.search, $options: 'i' } },
        { location: { $regex: filter.search, $options: 'i' } },
      ];
    }
    return await CommunityRequest.find(q).sort({ createdAt: -1 });
  }

  async getCommunityRequestById(id) {
    return await CommunityRequest.findById(id);
  }

  async createCommunityRequest(reqData) {
    return await CommunityRequest.create(reqData);
  }

  async updateCommunityRequest(id, updateData) {
    return await CommunityRequest.findByIdAndUpdate(id, updateData, { new: true });
  }

  async addOfferToCommunityRequest(id, offerData) {
    return await CommunityRequest.findByIdAndUpdate(
      id,
      { $push: { offers: offerData } },
      { new: true }
    );
  }

  async deleteCommunityRequest(id) {
    const res = await CommunityRequest.findByIdAndDelete(id);
    return !!res;
  }

  async getReports(filter = {}) {
    const q = {};
    if (filter.status && filter.status !== 'All') q.status = filter.status;
    return await Report.find(q).sort({ createdAt: -1 });
  }

  async createReport(reportData) {
    return await Report.create(reportData);
  }

  async updateReport(id, updateData) {
    return await Report.findByIdAndUpdate(id, updateData, { new: true });
  }

  async getImpactStats(userId = null) {
    const totalListings = await Item.countDocuments();
    const activeAvailableItems = await Item.countDocuments({ status: 'Available' });
    const completedItems = await Item.find({ status: 'Completed' });
    const completedExchanges = completedItems.length;
    const fulfilledCommunityRequests = await CommunityRequest.countDocuments({ status: 'Fulfilled' });

    const totalWasteDivertedKg = completedItems.reduce(
      (acc, curr) => acc + (Number(curr.estimatedWasteDivertedKg) || 0), 0
    );

    const co2SavedKg = Math.round(totalWasteDivertedKg * 1.85);
    const treeSeedlingsEquivalent = Math.round((co2SavedKg / 21.77) * 10) / 10;

    // Category breakdown
    const allItems = await Item.find();
    const categories = ['Books', 'Clothes', 'Electronics', 'Furniture', 'School Supplies', 'Other'];
    const categoryBreakdown = {};
    categories.forEach(c => (categoryBreakdown[c] = 0));
    allItems.forEach(i => {
      if (categoryBreakdown[i.category] !== undefined) {
        categoryBreakdown[i.category]++;
      } else {
        categoryBreakdown.Other = (categoryBreakdown.Other || 0) + 1;
      }
    });

    let userStats = null;
    if (userId) {
      const userDonations = await Item.find({ donor: userId });
      const userCompletedDonations = userDonations.filter(i => i.status === 'Completed');
      const userReceivedItems = await Item.find({ recipient: userId });
      const userCommunityReqs = await CommunityRequest.find({ requester: userId });

      const userWasteDivertedKg = userCompletedDonations.reduce(
        (acc, curr) => acc + (Number(curr.estimatedWasteDivertedKg) || 0), 0
      );

      userStats = {
        totalDonated: userDonations.length,
        completedDonations: userCompletedDonations.length,
        itemsReceived: userReceivedItems.length,
        communityRequestsPosted: userCommunityReqs.length,
        personalWasteDivertedKg: Math.round(userWasteDivertedKg * 10) / 10,
        personalCo2SavedKg: Math.round(userWasteDivertedKg * 1.85 * 10) / 10,
      };
    }

    return {
      totalListings,
      activeAvailableItems,
      completedExchanges,
      totalFulfilledCommunityRequests: fulfilledCommunityRequests,
      totalWasteDivertedKg: Math.round(totalWasteDivertedKg * 10) / 10,
      estimatedCo2SavedKg: co2SavedKg,
      treeSeedlingsEquivalent,
      categoryBreakdown,
      userStats,
    };
  }
}

// Lazy singletons
let localStoreInstance = null;
let mongoStoreInstance = null;

const getStorage = () => {
  if (getIsConnected()) {
    if (!mongoStoreInstance) mongoStoreInstance = new MongoStore();
    return mongoStoreInstance;
  }
  if (!localStoreInstance) localStoreInstance = new LocalStore();
  return localStoreInstance;
};

module.exports = { getStorage, CATEGORY_WEIGHT_MAP };
