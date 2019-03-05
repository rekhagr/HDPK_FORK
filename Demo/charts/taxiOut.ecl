IMPORT Visualizer;
IMPORT Demo;

OUTPUT(Demo.taxiRecord.taxiRecordDs,NAMED('taxiOut'));
Visualizer.MultiD.Bar('taxiVisu', /*datasource*/, 'taxiOut', /*mappings*/, /*filteredBy*/, /*dermatologyProperties*/ );
