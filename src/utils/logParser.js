import moment from 'moment';

export function parseLog(logContent) {
  const logEntryPattern = /^(\S+) (\S+) (\S+) \[([\w:/]+\s[+\-]\d{4})\] "(\S+) (\S+)\s*(\S*)" (\d{3}) (\S+) "([^"]*)" "([^"]*)"/;
  const lines = logContent.split('\n');
  const entries = lines
    .map((line) => {
      const match = logEntryPattern.exec(line);

      if (match) {
        const timestamp = moment(match[4], "DD/MMM/YYYY:HH:mm:ss ZZ").format("YYYY-MM-DD HH:mm:ss");
        return {
          ip: match[1],
          identity: match[2],
          user: match[3],
          timestamp,
          method: match[5],
          url: match[6],
          protocol: match[7],
          status: parseInt(match[8], 10),
          size: parseInt(match[9], 10),
          referrer: match[10],
          userAgent: match[11],
        };
      }

      return null;
    })
    .filter((entry) => entry !== null);

  return {
    entries,
    totalLines: lines.length,
  };
}