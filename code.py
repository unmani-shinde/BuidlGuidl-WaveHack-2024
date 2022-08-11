import glob
import numpy as np
from PIL import Image, ImageFilter

#Creating the output file that will store the results.
fopt = open("output.txt","w")
fopt.close()

#Function to calculate the distance between two points.
def distancefxn(x1,y1,x2,y2):
    distance = np.sqrt((pow((x1-x2),2))+pow((y1-y2),2))
    return distance

def main():
    direction=""        #Variable to store the predicted direction of the arrow.
    files = [x for x in sorted(glob.glob('*.png'))]         #Storing the paths of all image files to be accessed *.png represents all PNG files within the same folder.
    
    
    for filepath in files:
                
        arrImg= np.asarray(Image.open(filepath).convert("L"))   #Converting the image to grayscale.
        rows, columns = len(arrImg), len(arrImg[0])             #Getting the height and width of the grayscale image.
        whitePixhor, whitePixver = [],[]
        for i in range(rows):                                   #Array traversing to get all the horizontal white pixels.
            for j in range(columns):
                if arrImg[i][j]==255:
                    whitePixhor.append([i,j])                   #Appending the positions of white pixels.

        for i in range(columns):                                #Array traversing to get all the vertical white pixels.
            for j in range(rows):
                if arrImg[j][i]==255:
                    whitePixver.append([j,i])                   #Appending the positions of white pixels.


        # 1 = FH (First Horizontal White Pixel), 2 = FV (First Vertical White Pixel) , 3 = LH (Last Horizontal White Pixel), 4 = LV (Last Vertical White Pixel)
        #Indexes 0 and -1 represent the first and the last white pixel in that orientation respectively.
        
        FH,FV,LH,LV = np.array(whitePixhor[0]),np.array(whitePixver[0]),np.array(whitePixhor[-1]),np.array(whitePixver[-1])

        #Calculating the distances across the 4 extreme points that we have found.
      
        d_FHLV = distancefxn(FH[0],FH[1],LV[0],LV[1]) #1-4                                                                    
        d_LHLV = distancefxn(LH[0],LH[1],LV[0],LV[1]) #3-4       
        d_FHFV = distancefxn(FH[0],FH[1],FV[0],FV[1]) #1-2                                                                      
        d_LHFV = distancefxn(LH[0],LH[1],FV[0],FV[1]) #2-3                                                              
        d_FHLH = distancefxn(FH[0],FH[1],LH[0],LH[1]) #1-3                                                                                                                        
        d_FVLV = distancefxn(FV[0],FV[1],LV[0],LV[1]) #2-4
                
        maxd = max(d_FHLV, d_LHLV, d_FHFV, d_LHFV, d_FHLH, d_FVLV)  #Calculating the maximum of these distances.
        
        if maxd==d_FHLH: #1-3 is maximum, implies arrow should be either north or south pointing.
            mind =0 
            mind= min(d_FHFV,d_FHLV,d_LHFV,d_LHLV)                          
            if mind==d_FHFV or mind==d_FHLV:
                direction="TOP"
            else:
                direction="BOTTOM"
        elif maxd== d_FVLV: #2-4 is maximum, implies arrow should be either east or west facing.
            mind =0
            mind =min(d_FHLV,d_LHLV,d_FHFV,d_LHFV)
            if mind==d_FHFV or mind==d_LHFV:
                direction="LEFT"
            else:
                direction="RIGHT"
        else:
            print("Check condition again.")

        f1 = open("output.txt","a")     #Appending the found direction to the output file.
        f1.write(direction)
        f1.write("\n")
        f1.close()
        
        
try:
    main()
except:
    pass


        

        
        
   
        

