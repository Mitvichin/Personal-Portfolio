module.exports.Redis = jest.fn().mockImplementation(() => ({
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue('OK'),
  setex: jest.fn().mockReturnThis(),
  catch: jest.fn(),
  del: jest.fn().mockResolvedValue(1),
}));
