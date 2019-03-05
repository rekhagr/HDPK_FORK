/*
* Auto generated file, do not tweak. 
*/
IMPORT STD;
IMPORT newSample;
EXPORT sdas := MODULE
    EXPORT field_layout := RECORD
        STRING name;
        STRING fieldType;
        STRING fieldsize;
        STRING displayType;
        STRING displaySize;
        STRING minValue;
        STRING maxValue;
        STRING format;
        STRING transforms;
        BOOLEAN isNullable;
        STRING textJustification;
    END;
    EXPORT file_meta_layout := RECORD 
        STRING name;
        STRING fileType;
        STRING filePath;
        STRING format;
        BOOLEAN isChildLayout;
        DATASET (field_layout) fields; 
    END;
    

	EXPORT sdasLayout := RECORD 
		STRING gender;
		STRING briefsummary;
		STRING brieftitle;
 	END;

    EXPORT PATH :=  '~.::clinicalsample';
                   

    
    EXPORT sdasDs := DATASET(PATH, sdasLayout, FLAT);

   
    
    EXPORT sdasMeta := DATASET([{'name','fileType', 'filePath', 'format', 'isChildLayout', 
                    [{'name', 'fieldType', 'fieldsize', 'displayType', 'displaySize', 'minValue', 'maxValue'
                    , 'format', 'isNullable', 'transforms', 'textJustification'}]}], file_meta_layout);
    //Visualize
END;