IMPORT Visualizer;
IMPORT newSample;

OUTPUT(newSample.sdas.sdasDs,NAMED('outsdas'));
Visualizer.MultiD.Bar('visusdas', /*datasource*/, 'outsdas', /*mappings*/, /*filteredBy*/, /*dermatologyProperties*/ );
