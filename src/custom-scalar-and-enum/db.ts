enum Device {
  UNKNOWN = 'Other',
  DESKTOP = 'Computers',
  HIGH_END_MOBILE = 'Mobile devices with full browsers',
  TABLET = 'Tablets with full browsers',
  CONNECTED_TV = 'Devices streaming video content to TV screens',
}

export const db = {
  campaignPerformanceReports: [
    {
      campaignId: 1,
      campaignNme: 'test',
      device: Device.DESKTOP,
    },
  ],
};
