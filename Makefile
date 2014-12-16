ZIP_BIN = /usr/bin/zip
MV= /bin/mv
SRCS =js img index.html config.xml
NAME='restsql-operator'

all: zip
	@echo File Compressed
	
zip:
	@$(ZIP_BIN) -r $(NAME) -xi $(SRCS)
	@$(MV) $(NAME).zip $(NAME).wgt

clean:
	rm -rf *.zip
	rm -rf *.wgt
