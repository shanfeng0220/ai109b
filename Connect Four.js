package chess;

import java.awt.Color;
import java.awt.Graphics;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.image.BufferedImage;
import java.io.IOException;
import javax.imageio.ImageIO;
import javax.swing.JFrame;
import javax.swing.JOptionPane;

public class 四連環棋 extends JFrame implements MouseListener{
 /**
 * 為了在反序列化時，確保類版本的相容性，最好在每個要序列化的類中加入private static final long serialVersionUID這個屬性，具體數值自己定義.
 */
 private static final long serialVersionUID = 7715397504806319506L;
 
 int[][] allChess = new int[7][6]; // 用陣列來儲存棋子，0表示無子，1表示黑子，2表示紅子
 int[] chessX = new int[42];//儲存棋譜，記錄雙方每一步落子的位置
 int[] chessY = new int[42];
 int x; // 定義滑鼠的座標
 int y;
 boolean isblack = true; //用來表示黑子還是紅子， true表示黑子 false表示紅子
 boolean canPlay = true; // 用來表示當前遊戲是否結束
 BufferedImage background;
 
 四連環棋() {
 setBounds(600,270,580,450);//設定視窗的位置 座標，距左上角的，視窗的大小
 setVisible(true);//顯示視窗
 setTitle("四連環棋");
 setBackground(Color.yellow);
 addMouseListener(this);
 setDefaultCloseOperation(EXIT_ON_CLOSE);
 setResizable(false);//不可改變大小
 
 }
 
 //畫棋盤介面
 public void paint(Graphics g) {
 //異常處理，找不到背景圖片
 try {
 
 background=ImageIO.read(getClass().getResource("5.png"));
 
 }catch(IOException m) {
 m.printStackTrace();
 }
 g.drawImage(background,null);
 
  for(int i=0; i<7; i++){
 for (int j = 0; j < 6; j++) {
  //畫實心黑子
  if(allChess[i][j] == 1){ 
  int weizhiX = i*53+50;
  int weizhiY = j*53+68;
  g.setColor(Color.BLACK);
  g.fillOval(weizhiX,weizhiY,40,40);
  g.drawOval(weizhiX,40);
  }
  
  //畫實心白子
  if(allChess[i][j] == 2){
  int weizhiX = i*53+50;
  int weizhiY = j*53+68;
  g.setColor(Color.red);
  g.fillOval(weizhiX,40);
  }
 }
 } 
 
 }
 
 public void mousePressed(MouseEvent e) {
 
 x=e.getX();
 y=e.getY(); // 用來獲取滑鼠座標
 //異常處理
  if(e.getX()<=30 || e.getX()>= 460+43 || e.getY()<=50 ||e.getY()>=329+60) {
    try {
  throw new BeyondBoardException("您所點選位置超出棋盤");
  } catch (BeyondBoardException k) {
  // TODO 自動生成的 catch 塊
  System.out.println(k);
  }
  }
  
 if(x>43 && x<= 414 && y>=60 && y<=378){
  //讓滑鼠在棋盤範圍內
  if((x-69)%53>26){
  x=(x-69)/53 + 1;
  y=findEmptyPosition(x);
  }else {
  x = (x-69)/53;
  y=findEmptyPosition(x);
  }
 
  //落子
  if(allChess[x][y] == 0){
  
  if(isblack){
  allChess[x][y] = 1;
  isblack = false;
  
  }else {
  allChess[x][y] = 2;
  isblack = true;
  
  }
  this.repaint();
  if(this.Win()){
  if(allChess[x][y] == 1){
  JOptionPane.showMessageDialog(this,"遊戲結束，黑方勝利");
  }else {
  JOptionPane.showMessageDialog(this,"遊戲結束，紅方勝利");
  }
  this.canPlay = false; //表示遊戲結束
  }
  
  //判斷平局
  int sum=0;
  for(int i=0;i<7;i++) {
  for(int j=0;j<6;j++) {
  if(allChess[i][j]!=0) {
   sum++;
   if(sum==42)
   JOptionPane.showMessageDialog(this,"遊戲結束，雙方平局");
  }
  }
  } 
 }
 }
 
 //重新開始遊戲
 if(e.getX() >=430 && e.getX() <= (428+55) && e.getY() >= 66
 && e.getY() <= (66+20) ){
 int result = JOptionPane.showConfirmDialog(this,"是否重新開始遊戲？"); 
 if(result == 0){
  restarGame();
 }
 }
 
 //遊戲規則
 if(e.getX() >= 430 && e.getX() <= (430+55) && e.getY() >=106
 && e.getY() <= (106+20) ){
 JOptionPane.showMessageDialog(this,"規則:（1）雙人遊戲，有黑紅兩色棋子，雙方各執一色棋子。\r\n" + 
  "  （2）空棋局開盤，黑棋先發，從最上面一行開始下，棋子會落到最下行。\r\n" + 
  "  （3）黑、紅交替下子，每次只能下一子，從最上行開始下。\r\n" + 
  "  （4）棋子下在任何位置，都會掉落至該列的最下方的空格處，只有該列已有棋子時，該棋子才落在該列最上面棋子的上一格（就是往上摞棋子），以此類推。\r\n" + 
  "  （5）棋子下定後便不可以移動。\r\n" + 
  "  （6）不許悔棋，下定即確定。\r\n" + 
  "  （7）允許中途認輸，則對方獲勝。\r\n" + 
  "  （8）哪一方最先出現橫或豎或斜向四顆同色已落子，則該方獲勝。\r\n"+
  "  （9）若棋盤填滿棋子雙方仍未分出勝負則平局。");
 }
 
 //退出遊戲
 if(e.getX() >=430 && e.getX() <= (430+55) && e.getY() >=146 
  && e.getY() <= (146+20)){
 int result = JOptionPane.showConfirmDialog(this,"是否退出遊戲？");
 if(result == 0){
  System.exit(0);
 }
 }
 
 //認輸
   if(e.getX()>=430 && e.getX()<=(428+55) && e.getY()>=186 
   && e.getY()<=(186+20)){
    int result=JOptionPane.showConfirmDialog(this,"是否認輸?");
    if(result==0){
     JOptionPane.showMessageDialog(this,"遊戲結束,"+(isblack==true ? "黑方認輸，紅方獲勝!" : "紅方認輸，黑方獲勝!"));
    }
   }
 
 }
 
 
 public void restarGame(){
 for (int i = 0; i < 7; i++) {
  for (int j = 0; j < 6; j++) {
  allChess[i][j] = 0; //清空棋盤的棋子
  }
  
 }
 
 //清空下棋棋子座標的記錄
 for (int i = 0; i < 7; i++) {
  chessX[i] = 0;
 for (int j = 0; j < 6; j++) {
  chessY[j] = 0;
  }
  
 }
 
 isblack = true;
 canPlay = true;
 this.repaint();
 
 }
 
 // 判斷輸贏規則
 
 public boolean Win(){
 boolean flag = false;
 int count = 1; //用來儲存共有相同顏色多少棋子相連，初始值為1
 int color = allChess[x][y]; //color = 1 (黑子) color = 2(白子)
 
 //判斷橫向是否有4個棋子相連，特點:縱座標是相同，即allChess[x][y] 中y值是相同
 count = this.checkCount(1,color);
 if(count >= 4){
 flag = true;
 }else {
 //判斷縱向
 count = this.checkCount(0,1,color);
 if(count >= 4){
  flag = true;
 }else {
  //判斷右上,左下
  count = this.checkCount(1,-1,color);
  if(count >= 4){
  flag = true;
  }else {
  //判斷右下,左上
  count = this.checkCount(1,color);
  if(count >= 4){
  flag = true;
  }
  }
 }
 }
 
 return flag;
 }
 
 // 檢查棋盤中的棋是否連成四子
 
 public int checkCount(int heng,int zong,int color){
 int count = 1;
 int weizhiX = heng;
 int weizhiY = zong; //儲存初始值
 
 //尋找相同顏色的棋子
 while(x + heng >=0 && x+heng <7 && y+zong >=0 && 
  y+zong < 6 && color == allChess[x+heng][y+zong]){
 
 count++;
 if(heng != 0) heng++; 
 if(zong != 0 ){  
  if(zong != 0){
  if(zong > 0) { 
  zong++; 
  }else {
  zong--; 
  }
  }
 }
 
 }
 
 heng = weizhiX;
 zong = weizhiY; // 恢復初始值
 
 while(x-heng >=0 && x-heng <7 && y-zong >=0 &&
  y-zong <6 && color == allChess[x-heng][y-zong]){ 
 count++;
 if(heng != 0){
  heng++;
 }
 if(zong != 0){
  if (zong > 0) {
  zong++; 
  }else {
  zong--; 
  }
 }
 }
 
 return count;
 }
 
 public int findEmptyPosition(int i)
  { int j;
   //找到空的位置
   for (j = 5; j >= 0; j--)
   {
    if (allChess[i][j]==0)
    {
    return j;
    }
   }
 return j;
  }
 
 public void mouseClicked(MouseEvent e) {
 // TODO Auto-generated method stub
 
 }
 
 public void mouseReleased(MouseEvent e) {
 // TODO Auto-generated method stub
 
 }
 
 public void mouseEntered(MouseEvent e) {
 // TODO Auto-generated method stub
 
 }
 
 public void mouseExited(MouseEvent e) {
 // TODO Auto-generated method stub
 
 }
 
 public static void main(String[] args)throws BeyondBoardException {
 new 四連環棋();
 
 }
 
 }
//點選位置超出棋盤的異常
 class BeyondBoardException extends Exception{
 private static final long serialVersionUID = 1L;
 
 BeyondBoardException(String ErrorMessage){
 super(ErrorMessage);

 }
 
 }