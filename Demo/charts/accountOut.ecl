IMPORT Visualizer;
IMPORT Demo;

OUTPUT(Demo.accountRecord.accountRecordDs,NAMED('accountOut'));
Visualizer.MultiD.Area('accountVisu', /*datasource*/, 'accountOut', /*mappings*/, /*filteredBy*/, /*dermatologyProperties*/ );
