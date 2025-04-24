import { DateTimeConverter } from "./converts";

describe("date-time/converts", () => {
  it("should convert seconds to milliseconds", () => {
    const result = DateTimeConverter.convertToMilliseconds("seconds", 60);
    const expected = 60000; // 60 seconds in milliseconds
    expect(result).toBe(expected);
  });

  it("should convert minutes to milliseconds", () => {
    const result = DateTimeConverter.convertToMilliseconds("minutes", 5);
    const expected = 300000; // 5 minutes in milliseconds
    expect(result).toBe(expected);
  });

  it("should convert hours to milliseconds", () => {
    const result = DateTimeConverter.convertToMilliseconds("hours", 24);
    const expected = 86400000; // 24 hours in milliseconds
    expect(result).toBe(expected);
  });

  it("should convert days to milliseconds", () => {
    const result = DateTimeConverter.convertToMilliseconds("days", 7);
    const expected = 604800000; // 7 days in milliseconds
    expect(result).toBe(expected);
  });

  it("should convert weeks to milliseconds", () => {
    const result = DateTimeConverter.convertToMilliseconds("weeks", 2);
    const expected = 1209600000; // 2 weeks in milliseconds
    expect(result).toBe(expected);
  });

  it("should convert months to milliseconds", () => {
    const result = DateTimeConverter.convertToMilliseconds("months", 1);
    const expected = 2592000000; // 1 month in milliseconds (30 days)
    expect(result).toBe(expected);
  });

  it("should throw an error for invalid unit", () => {
    expect(() => {
      DateTimeConverter.convertToMilliseconds("invalid" as any, 1);
    }).toThrow("Invalid time unit");
  });

  it("should return the correct offsets", () => {
    const offsets = DateTimeConverter.$__OFFSETS;
    expect(offsets).toEqual({
      ms: 1,
      seconds: 1000,
      minutes: 60000,
      hours: 3600000,
      days: 86400000,
      weeks: 604800000,
      months: 2592000000,
    });
  });
});
