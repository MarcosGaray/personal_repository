﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace TP_II
{
    public partial class InfoForm : Form
    {
        Uri fileURI = new Uri(Application.StartupPath + @"/html/acercaDe.html");
        public InfoForm()
        {
            InitializeComponent();
            webBrowser1.Navigate(fileURI);
        }

        private void InfoForm_Load(object sender, EventArgs e)
        {

        }

        private void toolStripButton1_Click(object sender, EventArgs e)
        {
            webBrowser1.Navigate(fileURI);
        }
    }
}
