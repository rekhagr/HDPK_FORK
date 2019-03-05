/*
* Auto generated file, do not tweak. 
*/
IMPORT STD;
IMPORT Demo;
EXPORT accountRecord := MODULE
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
    

	EXPORT accountRecordLayout := RECORD 
		STRING10 searchkey;
		STRING30 payload;
 	END;

    EXPORT PATH :=  '~aact201503::search::fixedds::gender';
                   

    
    EXPORT accountRecordDs := DATASET(PATH, accountRecordLayout, FLAT);

   
    
    EXPORT accountRecordMeta := DATASET([{'name','fileType', 'filePath', 'format', 'isChildLayout', 
                    [{'name', 'fieldType', 'fieldsize', 'displayType', 'displaySize', 'minValue', 'maxValue'
                    , 'format', 'isNullable', 'transforms', 'textJustification'}]}], file_meta_layout);
    //Visualize
END;