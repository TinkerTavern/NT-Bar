#mmv "*.jpg" "#1p.jpg"
# Invert name
cd "$(pwd)"

files="*"                                                                   
total=$(ls "$(pwd)" | wc -l)  
for file in $files; do
  # Get the basename
  filename=$(basename "$file")

  # Get the extension
  extension="${filename##*.}"

  # Get the filename withoud the extension
  filename="${filename%.*}" 
  
  echo filename
done

#mmv "p*.jpg" "#1.jpg"
