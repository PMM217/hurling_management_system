// const Session = require('../models/Session');

// // Create a new session
// exports.createSession = async (req, res) => {
//   const { date, location, players } = req.body;
//   const session = new Session({ date, location, players });
//   await session.save();
//   res.status(201).json({ message: 'Session created successfully' });
// };

// // Mark attendance
// exports.markAttendance = async (req, res) => {
//   const { sessionId, playerId, role } = req.body;
//   const session = await Session.findById(sessionId);

//   if (!session) return res.status(404).json({ message: 'Session not found' });

//   const attendanceRecord = session.attendance.find(a => a.playerId.toString() === playerId);
//   if (attendanceRecord) {
//     if (role === 'manager') attendanceRecord.managerMarked = true;
//     if (role === 'player') attendanceRecord.playerMarked = true;
//     await session.save();
//     res.json({ message: 'Attendance marked' });
//   } else {
//     res.status(404).json({ message: 'Player not found in session' });
//   }
// };
