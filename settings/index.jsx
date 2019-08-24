function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Settings</Text>}>
      <Select
        label={`Meditate`}
        settingsKey="meditate"
        options={[
          { name: "5 minites", value: 5 },
          { name: "10 minites", value: 10 },
          { name: "15 minites", value: 15 },
          { name: "20 minites", value: 20 }
        ]}
      />
      </Section>
    </Page>
  );
}
registerSettingsPage(mySettings);
